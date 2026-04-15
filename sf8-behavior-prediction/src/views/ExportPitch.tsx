import { useState } from 'react'
import { getHeroCase, getAllCustomers, getExportData } from '../dataProvider'

export default function ExportPitch() {
  const heroCase = getHeroCase()
  const allCustomers = getAllCustomers()
  const [selectedId, setSelectedId] = useState(heroCase.id)
  
  const exportData = getExportData(selectedId)
  if (!exportData) return <div className="container">No data available</div>

  const { customer, product, score, explanation } = exportData

  function getScoreColor(sc: number): string {
    if (sc >= 75) return '#22c55e'
    if (sc >= 50) return '#eab308'
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

  function handlePrint() {
    window.print()
  }

  return (
    <div className="container">
      <div className="section-title">Export / Pitch View</div>
      <div className="section-subtitle">
        Generate snapshot for presentation and pitch
      </div>

      {/* Customer Selector */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
              Select Customer
            </label>
            <select 
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {allCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Score: {c.scoring.overallScore})</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Export Card */}
      <div className="export-card">
        <div className="export-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>
              SF8 - Customer Insight Report
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              AI-Powered Behavior Prediction • PoC Demo
            </div>
          </div>
          <div className="badge badge-info">Generated Demo Data</div>
        </div>

        {/* Customer Profile */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            Customer Profile
          </h3>
          <div className="detail-layout">
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Name</div>
                <div className="detail-value">{customer.name}</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Age</div>
                <div className="detail-value">{customer.age}</div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Occupation</div>
                <div className="detail-value">{customer.occupation}</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Income</div>
                <div className="detail-value">{(customer.income / 1000000).toFixed(1)}M VNĐ/month</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            AI Recommendation
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Overall Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(score.overallScore) }}>
                {score.overallScore}/100
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Recommended Product</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb' }}>
                {product.name}
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Action</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className={`badge ${getActionBadge(score.action)}`}>{score.action}</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Score Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Partner/Channel</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.pcf}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Behavior</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.bss}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Reaction</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.erq}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Affinity</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.pa}</div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem', color: '#1e40af' }}>
              🤖 AI Explanation
            </div>
            <div style={{ lineHeight: 1.6 }}>{explanation}</div>
          </div>

          {/* Outreach Note */}
          <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem', color: '#166534' }}>
              📝 Personalized Outreach Note
            </div>
            <div style={{ lineHeight: 1.6 }}>
              <p>Kính gửi <strong>{customer.name}</strong>,</p>
              <p style={{ marginTop: '0.5rem' }}>
                Dựa trên phân tích hành vi và nhu cầu của quý khách, chúng tôi xin đề xuất sản phẩm{' '}
                <strong>{product.name}</strong> với các ưu đãi đặc biệt:
              </p>
              <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                <li>Phê duyệt nhanh trong 24h</li>
                <li>Ưu đãi lãi suất 0% cho 3 tháng đầu</li>
                <li>Hỗ trợ tư vấn 24/7</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Liên hệ hotline 1900XXXX để được tư vấn chi tiết.
              </p>
            </div>
          </div>
        </div>

        {/* Signal Summary */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            Alternative Data Signal Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Telco</div>
              <div style={{ fontSize: '0.875rem' }}>
                {(customer.alternativeData.telco.monthlySpend / 1000000).toFixed(2)}M/tháng • {customer.alternativeData.telco.tenure} tháng
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">E-Wallet</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.eWallet.usage} • {customer.alternativeData.eWallet.monthlyTransactions} txn/tháng
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">E-commerce</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.ecommerce.monthlyOrders} đơn/tháng • {(customer.alternativeData.ecommerce.avgOrderValue / 1000000).toFixed(2)}M/đơn
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Social</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.social.activity} • {customer.alternativeData.social.interests.length} interests
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Disclosure */}
      <div className="disclosure">
        ⚠️ This report uses generated demo data for PoC purposes. Scores are relative within the demo set and do not represent absolute creditworthiness.
      </div>
    </div>
  )
}
