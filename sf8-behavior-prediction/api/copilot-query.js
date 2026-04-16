const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

function clampConfidence(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0.4
  return Math.max(0, Math.min(1, Number(num.toFixed(2))))
}

function extractJson(content) {
  if (typeof content !== 'string') return null
  const match = content.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function formatIncome(income) {
  return `${(Number(income || 0) / 1000000).toFixed(1)}M VND/thang`
}

function toActionText(action) {
  if (action === 'push now') return 'Uu tien tiep can'
  if (action === 'nurture') return 'Cham soc dinh ky'
  return 'Chua du dieu kien'
}

function detectIntent(question) {
  const normalized = normalizeText(question)
  if (/(xoa|delete|update|cap nhat|chinh sua|ghi vao|thay doi du lieu|drop table)/.test(normalized)) {
    return 'unsupported'
  }
  if (/(thong ke|tong quan|portfolio|toan bo|tong so|bao nhieu)/.test(normalized)) {
    return 'portfolio_stats'
  }
  if (/(vi sao|ly do|tai sao|giai thich diem|giai thich)/.test(normalized)) {
    return 'explain_score'
  }
  if (/(nen goi|hanh dong|buoc tiep theo|de xuat thao tac|next action)/.test(normalized)) {
    return 'next_action_reason'
  }
  if (/(khach|ho so|tom tat|thong tin khach|customer)/.test(normalized)) {
    return 'customer_summary'
  }
  return 'unsupported'
}

function findCustomer(question, context) {
  const customers = Array.isArray(context?.customers) ? context.customers : []
  const idMatch = String(question || '').match(/c\d{3}/i)
  if (idMatch) {
    const foundById = customers.find((item) => String(item.id).toLowerCase() === idMatch[0].toLowerCase())
    if (foundById) return foundById
  }

  const normalizedQuestion = normalizeText(question)
  const foundByName = customers.find((item) => normalizedQuestion.includes(normalizeText(item.name)))
  if (foundByName) return foundByName

  if (context?.selectedCustomerId) {
    return customers.find((item) => item.id === context.selectedCustomerId) || null
  }

  return customers[0] || null
}

function findProduct(productId, context) {
  const catalog = Array.isArray(context?.productCatalog) ? context.productCatalog : []
  return catalog.find((item) => item.id === productId) || null
}

function policyResponse() {
  return {
    intent: 'unsupported',
    answer:
      'Luu y he thong: AI chi dong vai tro khuyen nghi. Quyet dinh cap tin dung thuoc tham quyen cua can bo Shinhan.',
    evidence: [
      { label: 'AI boundary', value: 'Read-only, no mutation', source: 'policy.read_only' },
      { label: 'Human control', value: 'Nhan vien quyet dinh cuoi cung', source: 'policy.human_in_loop' }
    ],
    confidence: 0.98,
    riskFlag: 'ok',
    source: 'fallback'
  }
}

function buildDeterministicResponse(question, context) {
  if (!context || !Array.isArray(context.customers) || !context.stats) {
    return {
      intent: 'unsupported',
      answer: 'Khong co du lieu tong quan ho so de tra loi. Vui long tai lai man hinh Quan tri van hanh va thu lai.',
      evidence: [{ label: 'Context', value: 'Missing required context', source: 'context.validation' }],
      confidence: 0.2,
      riskFlag: 'needs_human_review',
      source: 'fallback'
    }
  }

  const intent = detectIntent(question)
  if (intent === 'unsupported') return policyResponse()

  if (intent === 'portfolio_stats') {
    const stats = context.stats
    return {
      intent,
      answer:
        `Tong danh muc hien co ${stats.total} khach hang. ` +
        `Uu tien tiep can: ${stats.pushNow}, cham soc dinh ky: ${stats.nurture}, chua du dieu kien: ${stats.hold}. ` +
        `Diem tin nhiem trung binh (Lead Score): ${stats.avgScore}/100.`,
      evidence: [
        { label: 'Tong khach hang', value: String(stats.total), source: 'context.stats.total' },
        { label: 'Co cau khuyen nghi xu ly', value: `${stats.pushNow}/${stats.nurture}/${stats.hold}`, source: 'context.stats.actions' },
        { label: 'Diem tin nhiem trung binh', value: `${stats.avgScore}/100`, source: 'context.stats.avgScore' }
      ],
      confidence: 0.93,
      riskFlag: 'ok',
      source: 'fallback'
    }
  }

  const customer = findCustomer(question, context)
  if (!customer) {
    return {
      intent,
      answer: 'Toi chua xac dinh duoc khach hang cu the. Vui long chon khach hang trong panel roi hoi lai.',
      evidence: [{ label: 'Customer match', value: 'Khong tim thay', source: 'context.customers' }],
      confidence: 0.34,
      riskFlag: 'needs_human_review',
      source: 'fallback'
    }
  }

  const product = findProduct(customer.recommendedProduct, context)
  const productLabel = product ? `${product.name} (${product.productCode})` : customer.recommendedProduct
  const actionLabel = toActionText(customer.action)

  if (intent === 'customer_summary') {
    return {
      intent,
      answer:
        `${customer.name} (${customer.id}) co diem Lead Score ${customer.overallScore}/100, khuyen nghi xu ly: ${actionLabel}. ` +
        `San pham phu hop hien tai: ${productLabel}. Thu nhap khai bao: ${formatIncome(customer.income)}.`,
      evidence: [
        { label: 'Diem Lead Score', value: `${customer.overallScore}/100`, source: `context.customers.${customer.id}.overallScore` },
        { label: 'Khuyen nghi xu ly', value: actionLabel, source: `context.customers.${customer.id}.action` },
        { label: 'San pham de xuat (NBO)', value: productLabel, source: `context.customers.${customer.id}.recommendedProduct` }
      ],
      confidence: 0.9,
      riskFlag: 'ok',
      source: 'fallback'
    }
  }

  if (intent === 'explain_score') {
    const positive = Array.isArray(customer.positiveFactors) && customer.positiveFactors.length
      ? customer.positiveFactors.slice(0, 3).join(', ')
      : 'chua du tin hieu tich cuc'
    const negative = Array.isArray(customer.negativeFactors) && customer.negativeFactors.length
      ? customer.negativeFactors.slice(0, 2).join(', ')
      : 'chua co canh bao lon'
    const confidence = Number(customer.confidence || 0)
    const riskFlag = confidence < 0.6 ? 'needs_human_review' : 'ok'

    return {
      intent,
      answer:
        `Diem Lead Score ${customer.overallScore}/100 cua ${customer.name} den tu tin hieu tich cuc: ${positive}. ` +
        `Can theo doi them: ${negative}. Muc do tin nhiem hien tai ${(confidence * 100).toFixed(0)}%.`,
      evidence: [
        { label: 'Tin hieu tich cuc', value: positive, source: `context.customers.${customer.id}.positiveFactors` },
        { label: 'Tin hieu can theo doi', value: negative, source: `context.customers.${customer.id}.negativeFactors` },
        { label: 'Muc do tin nhiem', value: `${(confidence * 100).toFixed(0)}%`, source: `context.customers.${customer.id}.confidence` }
      ],
      confidence: clampConfidence(confidence || 0.55),
      riskFlag,
      source: 'fallback'
    }
  }

  if (intent === 'next_action_reason') {
    const confidence = Number(customer.confidence || 0)
    const riskFlag = confidence < 0.65 ? 'needs_human_review' : 'ok'
    return {
      intent,
      answer:
        `Khuyen nghi xu ly hien tai la "${actionLabel}" voi san pham ${productLabel}. ` +
        `Neu nhan vien tiep can, nen dua thong diep ngan gon dua tren 2-3 tin hieu hanh vi manh nhat.`,
      evidence: [
        { label: 'Khuyen nghi xu ly', value: actionLabel, source: `context.customers.${customer.id}.action` },
        { label: 'San pham de xuat (NBO)', value: productLabel, source: `context.customers.${customer.id}.recommendedProduct` },
        { label: 'Muc do tin nhiem', value: `${(confidence * 100).toFixed(0)}%`, source: `context.customers.${customer.id}.confidence` }
      ],
      confidence: clampConfidence(Math.max(0.5, confidence)),
      riskFlag,
      source: 'fallback'
    }
  }

  return policyResponse()
}

function buildPrompt(question, deterministic) {
  return [
    'You are a read-only banking copilot for internal staff.',
    'Do not invent facts. Do not suggest any data mutation action.',
    'Return STRICT JSON with keys: answer, confidence, riskFlag.',
    'riskFlag must be either ok or needs_human_review.',
    '',
    `User question: ${question}`,
    `Deterministic answer: ${deterministic.answer}`,
    `Evidence: ${JSON.stringify(deterministic.evidence)}`,
    `Intent: ${deterministic.intent}`,
    '',
    'Constraints:',
    '- Keep answer in Vietnamese, max 70 words.',
    '- Preserve deterministic facts and numbers.',
    '- If uncertain, set riskFlag=needs_human_review and confidence <= 0.6.'
  ].join('\n')
}

async function tryQwenRewrite(apiKey, question, deterministic) {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You only output compact JSON.'
          },
          {
            role: 'user',
            content: buildPrompt(question, deterministic)
          }
        ]
      },
      parameters: {
        temperature: 0.1,
        max_tokens: 220,
        result_format: 'message'
      }
    })
  })

  if (!response.ok) return null
  const payload = await response.json()
  const content = payload?.output?.choices?.[0]?.message?.content || ''
  const parsed = extractJson(content)
  if (!parsed || typeof parsed.answer !== 'string') return null

  return {
    answer: parsed.answer.trim(),
    confidence: clampConfidence(parsed.confidence),
    riskFlag: parsed.riskFlag === 'ok' ? 'ok' : 'needs_human_review'
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const question = String(req.body?.question || '').trim()
  const context = req.body?.context

  if (!question) {
    return res.status(200).json({
      intent: 'unsupported',
      answer: 'Vui long nhap cau hoi cu the.',
      evidence: [{ label: 'Input', value: 'Empty question', source: 'request.question' }],
      confidence: 0.2,
      riskFlag: 'needs_human_review',
      source: 'fallback'
    })
  }

  const deterministic = buildDeterministicResponse(question, context)
  const apiKey = process.env.DASHSCOPE_API_KEY

  if (!apiKey) {
    return res.status(200).json(deterministic)
  }

  try {
    const qwen = await tryQwenRewrite(apiKey, question, deterministic)
    if (!qwen) {
      return res.status(200).json(deterministic)
    }

    return res.status(200).json({
      ...deterministic,
      answer: qwen.answer || deterministic.answer,
      confidence: qwen.confidence,
      riskFlag: qwen.riskFlag,
      source: 'qwen'
    })
  } catch {
    return res.status(200).json(deterministic)
  }
}
