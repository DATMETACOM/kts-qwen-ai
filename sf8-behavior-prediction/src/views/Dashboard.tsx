import { useNavigate } from 'react-router-dom'
import { getDashboardStats, getHeroCase } from '../dataProvider'
import { getConfidenceLabel, getConfidenceColor } from '../../lib/qwen'

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, productDistribution, customers } = getDashboardStats()
  const heroCase = getHeroCase()

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

  return (
    <div className="container">
      <div className="section-title">Dashboard Overview</div>
      <div className="section-subtitle">
        Portfolio of {stats.total} new customers analyzed with alternative data
      </div>

      {/* Stats Cards */}
      <div className="card-grid card-grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#22c55e' }}>{stats.pushNow}</div>
          <div className="stat-label">Push Now</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#eab308' }}>{stats.nurture}</div>
          <div className="stat-label">Nurture</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.hold}</div>
          <div className="stat-label">Hold</div>
        </div>
      </div>

      {/* Hero Case Highlight */}
      <div className="card" style={{ marginBottom: '2rem', background: '#f0f9ff', borderColor: '#0ea5e9' }}>
        <div className="section-title">⭐ Hero Case - Highest Scoring Customer</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
             onClick={() => navigate(`/customer/${heroCase.id}`)}>
          <div>
            <div style={{ fontWeight: 600 }}>{heroCase.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {heroCase.age} tuổi • {heroCase.occupation} • {(heroCase.income / 1000000).toFixed(1)}M VNĐ/tháng
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
              {heroCase.scoring.overallScore}/100
            </div>
            <div className={`badge ${getActionBadge(heroCase.scoring.action)}`}>
              {heroCase.scoring.action}
            </div>
          </div>
        </div>
      </div>

      {/* Product Distribution */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="section-title">Product Recommendation Distribution</div>
        <div className="card-grid card-grid-4">
          {productDistribution.map(({ product, count }) => (
            <div key={product.id} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>{count}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{product.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="card">
        <div className="section-title">Customer Lead List</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Occupation</th>
                <th>Income</th>
                <th>Score</th>
                <th>Product</th>
                <th>Action</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => {
                const product = productDistribution.find(
                  pd => pd.product.id === customer.scoring.recommendedProduct
                )?.product.name

                return (
                  <tr key={customer.id} 
                      className="cursor-pointer"
                      onClick={() => navigate(`/customer/${customer.id}`)}>
                    <td style={{ fontWeight: 500 }}>{customer.name}</td>
                    <td>{customer.age}</td>
                    <td>{customer.occupation}</td>
                    <td>{(customer.income / 1000000).toFixed(1)}M</td>
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
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {customer.scoring.overallScore}
                        </span>
                      </div>
                    </td>
                    <td>{product}</td>
                    <td>
                      <span className={`badge ${getActionBadge(customer.scoring.action)}`}>
                        {customer.scoring.action}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        color: getConfidenceColor(customer.scoring.confidence),
                        fontWeight: 600
                      }}>
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

      {/* Governance Disclosure */}
      <div className="disclosure">
        ⚠️ This demo uses generated customer data for PoC purposes. Scores are relative within the demo set, not absolute creditworthiness.
      </div>
    </div>
  )
}
