const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

function clampAdjustment(value) {
  if (!Number.isFinite(value)) return 0
  return Math.max(-10, Math.min(10, Math.round(value)))
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

function buildPrompt(body) {
  const customer = body?.customer || {}
  const altData = body?.altData || {}
  const baseScore = Number(body?.baseScore || 0)
  const recommendedProduct = String(body?.recommendedProduct || 'n/a')

  return [
    'You are a financial behavior analyst.',
    'Input is deterministic baseline scoring plus customer alternative signals.',
    'Task: suggest a bounded adjustment from -10 to +10 for nuance only.',
    'Never replace baseline scoring logic.',
    'Return STRICT JSON with keys: adjustment, reasoning.',
    '',
    `Customer: ${customer.name || 'unknown'}, age ${customer.age || 'n/a'}, income ${customer.income || 'n/a'}`,
    `Base score: ${baseScore}`,
    `Recommended product: ${recommendedProduct}`,
    `Telco: ${JSON.stringify(altData.telco || {})}`,
    `E-wallet: ${JSON.stringify(altData.eWallet || {})}`,
    `E-commerce: ${JSON.stringify(altData.ecommerce || {})}`,
    `Social: ${JSON.stringify(altData.social || {})}`,
    '',
    'Rules:',
    '- Keep adjustment conservative.',
    '- Positive adjustment only for consistent strong signals across multiple sources.',
    '- Negative adjustment for contradictory or weak signals.',
    '- reasoning max 35 words.'
  ].join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.QWEN_API_KEY
  if (!apiKey) {
    return res.status(200).json({
      adjustment: 0,
      reasoning: 'DASHSCOPE_API_KEY is missing. Using deterministic baseline.',
      source: 'fallback'
    })
  }

  try {
    const prompt = buildPrompt(req.body)

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
              content: 'You produce compact JSON only.'
            },
            {
              role: 'user',
              content: prompt
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

    if (!response.ok) {
      const text = await response.text()
      return res.status(200).json({
        adjustment: 0,
        reasoning: `Qwen request failed (${response.status}). Using deterministic baseline.`,
        source: 'fallback',
        debug: text.slice(0, 300)
      })
    }

    const payload = await response.json()
    const content = payload?.output?.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content) || {}

    return res.status(200).json({
      adjustment: clampAdjustment(Number(parsed.adjustment || 0)),
      reasoning: typeof parsed.reasoning === 'string' && parsed.reasoning.trim()
        ? parsed.reasoning.trim()
        : 'Qwen enhancement applied with conservative adjustment.',
      source: 'qwen',
      model: payload?.output?.model || 'qwen-plus'
    })
  } catch (error) {
    return res.status(200).json({
      adjustment: 0,
      reasoning: 'Qwen enhancement error. Using deterministic baseline.',
      source: 'fallback',
      error: String(error?.message || error)
    })
  }
}
