import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCustomerById, runSimulation } from '../dataProvider'
import { PRODUCTS } from '../lib/data'
import { applyEnhancement, getQwenEnhancement } from '../lib/qwen'
import { SimulationResult, ScoringResult, QwenEnhancement } from '../types'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [simVariable, setSimVariable] = useState<'partner_channel' | 'product_offer' | 'early_reaction'>('partner_channel')
  const [simValue, setSimValue] = useState('high_engagement')

  const [enhancing, setEnhancing] = useState(false)
  const [enhancement, setEnhancement] = useState<QwenEnhancement | null>(null)
  const [enhancedScoring, setEnhancedScoring] = useState<ScoringResult | null>(null)

  const customer = id ? getCustomerById(id) : null
  const selectedProduct = useMemo(
    () => PRODUCTS.find((item) => item.id === customer?.scoring.recommendedProduct),
    [customer?.scoring.recommendedProduct]
  )

  useEffect(() => {
    const currentCustomer = customer
    if (!currentCustomer) return
    const stableCustomer = currentCustomer

    let active = true

    async function runEnhancement() {
      setEnhancing(true)
      const result = await getQwenEnhancement({
        customer: stableCustomer,
        altData: stableCustomer.alternativeData,
        baseScore: stableCustomer.scoring.overallScore,
        recommendedProduct: stableCustomer.scoring.recommendedProduct
      })

      if (!active) return

      setEnhancement(result)
      setEnhancedScoring(applyEnhancement(stableCustomer.scoring, result))
      setEnhancing(false)
    }

    runEnhancement()

    return () => {
      active = false
    }
  }, [customer])

  if (!customer) return <div className="container">Customer not found</div>

  const scoringToDisplay = enhancedScoring || customer.scoring
  const { breakdown, overallScore, action, confidence, recommendedProduct } = scoringToDisplay

  function getScoreColor(score: number): string {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

  function getActionBadge(currentAction: string): string {
    switch (currentAction) {
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

  function toActionLabel(currentAction: string): string {
    if (currentAction === 'push now') return 'Uu tien tiep can'
    if (currentAction === 'nurture') return 'Cham soc dinh ky'
    return 'Chua du dieu kien'
  }

  function handleRunSimulation() {
    if (!id) return
    const result = runSimulation(id, simVariable, simValue)
    setSimulation(result || null)
  }

  function buildNextStepNote(): string {
    if (action === 'push now') {
      return `Uu tien tiep can voi ${selectedProduct?.name || recommendedProduct} theo kich ban phu hop hanh vi.`
    }
    if (action === 'nurture') {
      return `Cham soc dinh ky voi ${selectedProduct?.name || recommendedProduct}, bo sung them tin hieu hanh vi truoc khi de xuat ho so.`
    }
    return `Chua du dieu kien tiep can ngay voi ${selectedProduct?.name || recommendedProduct}. Can bo sung du lieu va tham dinh truoc khi tiep tuc.`
  }

  return (
    <div className="container">
      <button className="btn btn-outline" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem' }}>
        Quay lai Quan tri van hanh
      </button>

      <div className="section-title">{customer.name}</div>
      <div className="section-subtitle">
        {customer.age} tuoi | {customer.occupation} | {(customer.income / 1000000).toFixed(1)}M VND/thang
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="detail-layout">
          <div>
            <div className="detail-label">Diem tiem nang (Lead Score)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getScoreColor(overallScore) }}>
              {overallScore}/100
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={`badge ${getActionBadge(action)}`}>{toActionLabel(action)}</span>
            </div>
          </div>
          <div>
            <div className="detail-label">Muc do tin nhiem</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{Math.round(confidence * 100)}%</div>
            <div className="detail-label" style={{ marginTop: '1rem' }}>San pham de xuat (NBO)</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2563eb' }}>
              {selectedProduct?.name || recommendedProduct}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Lop phan tich AI bo sung</div>
        {enhancing ? <div>Dang ap dung phan tich Qwen...</div> : null}
        {!enhancing && enhancement ? (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              Nguon: <strong>{enhancement.source === 'qwen' ? 'Qwen API' : 'Fallback'}</strong>
              {enhancement.model ? ` (${enhancement.model})` : ''}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              Bien do dieu chinh diem: <strong>{enhancement.adjustment >= 0 ? '+' : ''}{enhancement.adjustment}</strong>
            </div>
            <div style={{ padding: '0.75rem', background: '#f3f4f6', borderRadius: '8px', lineHeight: 1.5 }}>
              {enhancement.reasoning}
            </div>
          </>
        ) : null}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Cau phan bo diem</div>
        <div className="card-grid card-grid-4">
          <div>
            <div className="detail-label">Do phu hop kenh tiep can</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.pcf}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.pcf}%`, background: '#2563eb' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Tin hieu hanh vi</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.bss}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.bss}%`, background: '#22c55e' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Tin hieu chuyen doi som</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.erq}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.erq}%`, background: '#eab308' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Do phu hop san pham</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.pa}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.pa}%`, background: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-layout" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="section-title">Tin hieu Du lieu thay the (Alternative Data)</div>

          <div className="detail-section">
            <div className="detail-label">Telco</div>
            <div className="detail-value">
              {(customer.alternativeData.telco.monthlySpend / 1000000).toFixed(2)}M/month •
              {customer.alternativeData.telco.tenure} months •
              {customer.alternativeData.telco.dataUsage}GB
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Vi dien tu</div>
            <div className="detail-value">
              {customer.alternativeData.eWallet.usage} •
              {customer.alternativeData.eWallet.monthlyTransactions} transactions/month
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Categories: {customer.alternativeData.eWallet.categories.join(', ')}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Thuong mai dien tu</div>
            <div className="detail-value">
              {customer.alternativeData.ecommerce.monthlyOrders} orders/month •
              {(customer.alternativeData.ecommerce.avgOrderValue / 1000000).toFixed(2)}M/order
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Categories: {customer.alternativeData.ecommerce.categories.join(', ')}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">Social</div>
            <div className="detail-value">
              Activity: {customer.alternativeData.social.activity}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Interests: {customer.alternativeData.social.interests.join(', ')}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Tom tat ho so & De xuat phuong an xu ly</div>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', lineHeight: 1.6 }}>
            {customer.explanation}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div className="detail-label">Khuyen nghi xu ly tiep theo</div>
            <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '8px', marginTop: '0.5rem' }}>
              {buildNextStepNote()}
            </div>
          </div>
        </div>
      </div>

      <div className="simulation-panel">
        <div className="section-title">Phan tich gia dinh</div>

        <div className="simulation-controls">
          <div className="simulation-control">
            <label>Bien gia dinh</label>
            <select value={simVariable} onChange={(e) => setSimVariable(e.target.value as any)}>
              <option value="partner_channel">Muc do tuong tac kenh tiep can</option>
              <option value="product_offer">Dieu kien san pham de xuat</option>
              <option value="early_reaction">Tin hieu chuyen doi som</option>
            </select>
          </div>

          <div className="simulation-control">
            <label>Gia tri gia dinh</label>
            <select value={simValue} onChange={(e) => setSimValue(e.target.value)}>
              {simVariable === 'partner_channel' ? (
                <>
                  <option value="high_engagement">Tuong tac cao</option>
                  <option value="low_engagement">Tuong tac thap</option>
                </>
              ) : null}
              {simVariable === 'product_offer' ? <option value="premium_offer">De xuat uu dai cao</option> : null}
              {simVariable === 'early_reaction' ? (
                <>
                  <option value="high_response">Phan hoi cao</option>
                  <option value="low_response">Phan hoi thap</option>
                </>
              ) : null}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleRunSimulation}>
            Chay phan tich gia dinh
          </button>
        </div>

        {simulation ? (
          <div className="simulation-result">
            <div className="simulation-comparison">
              <div className="detail-label">Diem goc</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{simulation.baseScore}</div>
            </div>
            <div className="simulation-comparison">
              <div className="detail-label">Diem sau gia dinh</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{simulation.overallScore}</div>
            </div>
            <div className="simulation-comparison" style={{ gridColumn: 'span 2' }}>
              <div className="detail-label">Delta</div>
              <div className={`simulation-delta ${simulation.delta >= 0 ? 'delta-positive' : 'delta-negative'}`}>
                {simulation.delta >= 0 ? '+' : ''}
                {simulation.delta}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Bien thay doi: {simulation.changedVariable}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="disclosure">
        Luu y he thong: AI chi dong vai tro khuyen nghi. Quyet dinh cap tin dung thuoc tham quyen cua can bo Shinhan.
      </div>
    </div>
  )
}
