import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCopilotContext, getDashboardStats, getHeroCase } from '../dataProvider'
import { askCopilot } from '../lib/copilot'
import { PRODUCTS } from '../lib/data'
import { CopilotResponse } from '../types'
import { getConfidenceColor, getConfidenceLabel } from '../lib/qwen'

type ChatEntry =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; payload?: CopilotResponse }

const QUICK_PROMPTS = [
  'Thong ke tong quan danh muc hien tai',
  'Tom tat ho so khach c001 va de xuat phuong an xu ly',
  'Vi sao diem tin nhiem cua khach hang trong tam cao hon trung binh?'
]

function formatVnd(value: number): string {
  return `${(value / 1000000).toFixed(1)}M`
}

function toActionLabel(action: string): string {
  if (action === 'push now') return 'Uu tien tiep can'
  if (action === 'nurture') return 'Cham soc dinh ky'
  return 'Chua du dieu kien'
}

function toRiskLabel(flag: string): string {
  return flag === 'ok' ? 'Dat nguong tham khao' : 'Can tham dinh bo sung'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, productDistribution, customers } = getDashboardStats()
  const heroCase = getHeroCase()

  const [selectedCustomerId, setSelectedCustomerId] = useState(heroCase.id)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([
    {
      id: 'seed-assistant',
      role: 'assistant',
      text: 'Tro ly AI dang o che do Phan tich & Khuyen nghi (PoC). Ban co the hoi ve ho so khach hang, diem lead va thong ke danh muc.'
    }
  ])

  const selectedCustomer = useMemo(
    () => customers.find((item) => item.id === selectedCustomerId),
    [customers, selectedCustomerId]
  )

  function getScoreColor(score: number): string {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

  function getActionBadge(action: string): string {
    switch (action) {
      case 'push now':
        return 'badge-success'
      case 'nurture':
        return 'badge-warning'
      case 'hold':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  async function handleAsk(rawQuestion?: string) {
    const nextQuestion = (rawQuestion || question).trim()
    if (!nextQuestion || asking) return

    setChatEntries((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: nextQuestion
      }
    ])

    setQuestion('')
    setAsking(true)

    const context = getCopilotContext(selectedCustomerId)
    const response = await askCopilot(nextQuestion, context)

    setChatEntries((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response.answer,
        payload: response
      }
    ])

    setAsking(false)
  }

  return (
    <div className="container">
      <div className="section-title">(SF8) Cuca-Insider-AI - Quan tri van hanh</div>
      <div className="section-subtitle">
        (SF8) Cuca-Insider-AI - Cham diem khach hang qua Du lieu thay the (Alternative Data). AI chi dong vai tro phan tich va khuyen nghi.
      </div>

      <div className="card-grid card-grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tong Khach Hang</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#22c55e' }}>{stats.pushNow}</div>
          <div className="stat-label">Uu Tien Tiep Can</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#eab308' }}>{stats.nurture}</div>
          <div className="stat-label">Cham Soc Dinh Ky</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#2563eb' }}>{stats.avgScore}</div>
          <div className="stat-label">Diem tin nhiem trung binh</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', borderColor: '#0ea5e9', background: '#f0f9ff' }}>
        <div className="section-title">Khach hang trong tam</div>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate(`/customer/${heroCase.id}`)}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{heroCase.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {heroCase.age} tuoi | {heroCase.occupation} | {formatVnd(heroCase.income)} VND/thang
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
              {heroCase.scoring.overallScore}/100
            </div>
            <div className={`badge ${getActionBadge(heroCase.scoring.action)}`}>{toActionLabel(heroCase.scoring.action)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Co cau san pham de xuat (NBO)</div>
        <div className="card-grid card-grid-4">
          {productDistribution.map(({ product, count }) => (
            <div key={product.id} style={{ textAlign: 'center', padding: '0.75rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb' }}>{count}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{product.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Danh sach Khach hang tiem nang (Pipeline)</div>
        <div className="section-subtitle">Hien thi {customers.length}/{stats.total} khach hang</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Khach Hang</th>
                <th>Nghe Nghiep</th>
                <th>Thu Nhap</th>
                <th>Diem</th>
                <th>San Pham</th>
                <th>Khuyen nghi xu ly</th>
                <th>Muc do tin nhiem</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const product = PRODUCTS.find((item) => item.id === customer.scoring.recommendedProduct)

                return (
                  <tr key={customer.id} className="cursor-pointer" onClick={() => navigate(`/customer/${customer.id}`)}>
                    <td style={{ fontWeight: 600 }}>{customer.name}</td>
                    <td>{customer.occupation}</td>
                    <td>{formatVnd(customer.income)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="score-bar">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${customer.scoring.overallScore}%`,
                              background: getScoreColor(customer.scoring.overallScore)
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700 }}>{customer.scoring.overallScore}</span>
                      </div>
                    </td>
                    <td>{product?.name || customer.scoring.recommendedProduct}</td>
                    <td>
                      <span className={`badge ${getActionBadge(customer.scoring.action)}`}>
                        {toActionLabel(customer.scoring.action)}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          color: getConfidenceColor(customer.scoring.confidence),
                          fontWeight: 700
                        }}
                      >
                        {getConfidenceLabel(customer.scoring.confidence)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ops-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="section-title">Danh muc san pham de xuat (NBO)</div>
          <div className="catalog-list">
            {PRODUCTS.map((product) => (
              <div className="catalog-item" key={product.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <strong>{product.name}</strong>
                  <span className="badge badge-info">{product.productCode || product.id}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>{product.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
                  Dieu kien thu nhap: {formatVnd(product.minIncome)}
                </div>
                {product.keyTerms ? (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
                    {product.keyTerms.limitHint || ''}
                    {product.keyTerms.limitHint && product.keyTerms.tenorHint ? ' | ' : ''}
                    {product.keyTerms.tenorHint || ''}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="card chat-shell">
          <div className="section-title">AI Copilot - Phan tich va Khuyen nghi (PoC)</div>
          <div className="section-subtitle">Pham vi: thong ke danh muc, tom tat ho so, giai thich diem, de xuat huong tiep can.</div>

          <div className="chat-toolbar">
            <label htmlFor="chat-customer">Tong quan ho so (Customer 360)</label>
            <select
              id="chat-customer"
              value={selectedCustomerId}
              onChange={(event) => setSelectedCustomerId(event.target.value)}
            >
              {customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.name}
                </option>
              ))}
            </select>
            <div className="chat-note">
              Dang chon: <strong>{selectedCustomer?.name || 'N/A'}</strong>
            </div>
          </div>

          <div className="prompt-row">
            {QUICK_PROMPTS.map((item) => (
              <button key={item} className="prompt-chip" onClick={() => handleAsk(item)} disabled={asking}>
                {item}
              </button>
            ))}
          </div>

          <div className="chat-history">
            {chatEntries.map((entry) => {
              if (entry.role === 'user') {
                return (
                  <div className="chat-msg chat-user" key={entry.id}>
                    <div className="chat-role">Ban</div>
                    <div>{entry.text}</div>
                  </div>
                )
              }

              return (
                <div className="chat-msg chat-assistant" key={entry.id}>
                  <div className="chat-role">AI Copilot</div>
                  <div>{entry.text}</div>
                  {entry.payload ? (
                    <>
                      <div className="meta-grid">
                        <span className="badge badge-info">Nguon: {entry.payload.source === 'qwen' ? 'Qwen' : 'Fallback'}</span>
                        <span className="badge badge-info">Intent: {entry.payload.intent}</span>
                        <span className={`risk-pill ${entry.payload.riskFlag === 'ok' ? 'risk-ok' : 'risk-review'}`}>
                          {toRiskLabel(entry.payload.riskFlag)} ({Math.round(entry.payload.confidence * 100)}%)
                        </span>
                      </div>
                      {entry.payload.evidence.length ? (
                        <div className="evidence-list">
                          {entry.payload.evidence.map((item, index) => (
                            <div className="evidence-item" key={`${entry.id}-${index}`}>
                              <strong>{item.label}:</strong> {item.value}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              )
            })}
            {asking ? <div className="chat-msg chat-assistant">Dang phan tich...</div> : null}
          </div>

          <div className="chat-input-row">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Hoi ve khach hang, diem, khuyen nghi xu ly hoac thong ke danh muc..."
              rows={3}
            />
            <button className="btn btn-primary" onClick={() => handleAsk()} disabled={asking || !question.trim()}>
              Gui cau hoi
            </button>
          </div>
        </div>
      </div>

      <div className="disclosure">
        Luu y he thong: AI chi dong vai tro khuyen nghi. Quyet dinh cap tin dung thuoc tham quyen cua can bo Shinhan.
      </div>
    </div>
  )
}
