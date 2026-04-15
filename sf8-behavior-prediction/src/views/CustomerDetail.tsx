import { useParams, useNavigate } from 'react-router-dom'
import { getCustomerById, runSimulation } from '../dataProvider'
import { useState } from 'react'
import { SimulationResult } from '../../lib/scoring'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [simVariable, setSimVariable] = useState<"partner_channel" | "product_offer" | "early_reaction">("partner_channel")
  const [simValue, setSimValue] = useState("high_engagement")

  const customer = id ? getCustomerById(id) : null
  if (!customer) return <div className="container">Customer not found</div>

  const { breakdown, overallScore, action, confidence, recommendedProduct } = customer.scoring

  function getScoreColor(score: number): string {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#eab308'
    return '#ef4444'
  }

  function getActionBadge(action: string): string {
    switch (action) {
      case 'push now': return 'badge-success'
      case 'nurture': return 'badge-warning'
      case 'hold': return 'badge-danger'
      default: return 'badge-info'
    }
  }

  function handleRunSimulation() {
    if (id) {
      const result = runSimulation(id, simVariable, simValue)
      setSimulation(result || null)
    }
  }

  return (
    <div className="container">
      <button className="btn btn-outline" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem' }}>
        ← Back to Dashboard
      </button>

      <div className="section-title">{customer.name}</div>
      <div className="section-subtitle">
        {customer.age} tuổi • {customer.occupation} • {(customer.income / 1000000).toFixed(1)}M VNĐ/tháng
      </div>

      {/* Score Overview */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="detail-layout">
          <div>
            <div className="detail-label">Overall Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getScoreColor(overallScore) }}>
              {overallScore}/100
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={`badge ${getActionBadge(action)}`}>{action}</span>
            </div>
          </div>
          <div>
            <div className="detail-label">Confidence</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{(confidence * 100).toFixed(0)}%</div>
            <div className="detail-label" style={{ marginTop: '1rem' }}>Recommended Product</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2563eb' }}>
              {recommendedProduct}
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title">Score Breakdown</div>
        <div className="card-grid card-grid-4">
          <div>
            <div className="detail-label">Partner/Channel Fit</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.pcf}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.pcf}%`, background: '#2563eb' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Behavior Signal</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.bss}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.bss}%`, background: '#22c55e' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Early Reaction</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.erq}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.erq}%`, background: '#eab308' }} />
            </div>
          </div>
          <div>
            <div className="detail-label">Product Affinity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{breakdown.pa}</div>
            <div className="score-bar" style={{ marginTop: '0.5rem' }}>
              <div className="score-bar-fill" style={{ width: `${breakdown.pa}%`, background: '#8b5cf6' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Data Signals */}
      <div className="detail-layout" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="section-title">Alternative Data Signals</div>
          
          <div className="detail-section">
            <div className="detail-label">Telco</div>
            <div className="detail-value">
              {(customer.alternativeData.telco.monthlySpend / 1000000).toFixed(2)}M/tháng • 
              {customer.alternativeData.telco.tenure} tháng • 
              {customer.alternativeData.telco.dataUsage}GB
            </div>
          </div>
          
          <div className="detail-section">
            <div className="detail-label">E-Wallet</div>
            <div className="detail-value">
              {customer.alternativeData.eWallet.usage} • 
              {customer.alternativeData.eWallet.monthlyTransactions} giao dịch/tháng
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Categories: {customer.alternativeData.eWallet.categories.join(', ')}
            </div>
          </div>
          
          <div className="detail-section">
            <div className="detail-label">E-commerce</div>
            <div className="detail-value">
              {customer.alternativeData.ecommerce.monthlyOrders} đơn/tháng • 
              {(customer.alternativeData.ecommerce.avgOrderValue / 1000000).toFixed(2)}M/đơn
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
          <div className="section-title">AI Explanation</div>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', lineHeight: 1.6 }}>
            {customer.explanation}
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div className="detail-label">Recommended Next Action</div>
            <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '8px', marginTop: '0.5rem' }}>
              Liên hệ khách hàng để giới thiệu sản phẩm phù hợp
            </div>
          </div>
        </div>
      </div>

      {/* Inline Simulation Panel */}
      <div className="simulation-panel">
        <div className="section-title">What-If Simulation</div>
        
        <div className="simulation-controls">
          <div className="simulation-control">
            <label>Variable to Change</label>
            <select value={simVariable} onChange={e => setSimVariable(e.target.value as any)}>
              <option value="partner_channel">Partner/Channel Engagement</option>
              <option value="product_offer">Product Offer Terms</option>
              <option value="early_reaction">Early Reaction Signal</option>
            </select>
          </div>
          
          <div className="simulation-control">
            <label>New Value</label>
            <select value={simValue} onChange={e => setSimValue(e.target.value)}>
              {simVariable === 'partner_channel' && (
                <>
                  <option value="high_engagement">High Engagement</option>
                  <option value="low_engagement">Low Engagement</option>
                </>
              )}
              {simVariable === 'product_offer' && (
                <>
                  <option value="premium_offer">Premium Offer</option>
                </>
              )}
              {simVariable === 'early_reaction' && (
                <>
                  <option value="high_response">High Response</option>
                  <option value="low_response">Low Response</option>
                </>
              )}
            </select>
          </div>
          
          <button className="btn btn-primary" onClick={handleRunSimulation}>
            Run Simulation
          </button>
        </div>

        {simulation && (
          <div className="simulation-result">
            <div className="simulation-comparison">
              <div className="detail-label">Base Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{simulation.baseScore}</div>
            </div>
            <div className="simulation-comparison">
              <div className="detail-label">Simulated Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{simulation.overallScore}</div>
            </div>
            <div className="simulation-comparison" style={{ gridColumn: 'span 2' }}>
              <div className="detail-label">Delta</div>
              <div className={`simulation-delta ${simulation.delta >= 0 ? 'delta-positive' : 'delta-negative'}`}>
                {simulation.delta >= 0 ? '+' : ''}{simulation.delta}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Changed: {simulation.changedVariable}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Governance Disclosure */}
      <div className="disclosure">
        ⚠️ Generated demo data for PoC. Scores are relative within demo set, not absolute creditworthiness.
      </div>
    </div>
  )
}
