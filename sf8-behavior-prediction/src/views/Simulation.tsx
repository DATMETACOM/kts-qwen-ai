import { useState } from 'react'
import { getAllCustomers, runSimulation, getHeroCase } from '../dataProvider'
import { SimulationResult } from '../../lib/scoring'

export default function Simulation() {
  const customers = getAllCustomers()
  const heroCase = getHeroCase()
  const [selectedCustomerId, setSelectedCustomerId] = useState(heroCase.id)
  const [variable, setVariable] = useState<"partner_channel" | "product_offer" | "early_reaction">("partner_channel")
  const [newValue, setNewValue] = useState("high_engagement")
  const [results, setResults] = useState<SimulationResult[]>([])

  function handleRunSimulation() {
    const result = runSimulation(selectedCustomerId, variable, newValue)
    if (result) {
      setResults(prev => [...prev, result])
    }
  }

  function handleRunAll() {
    const newResults: SimulationResult[] = []
    customers.forEach(customer => {
      const result = runSimulation(customer.id, variable, newValue)
      if (result) newResults.push(result)
    })
    setResults(newResults)
  }

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  return (
    <div className="container">
      <div className="section-title">Simulation Workspace</div>
      <div className="section-subtitle">
        What-if analysis across 3 variables: partner/channel, product/offer, early reaction
      </div>

      {/* Simulation Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="detail-layout">
          <div>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Customer</div>
            <select 
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Score: {c.scoring.overallScore})</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Variable</div>
            <select 
              value={variable}
              onChange={e => setVariable(e.target.value as any)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option value="partner_channel">Partner/Channel Engagement</option>
              <option value="product_offer">Product Offer Terms</option>
              <option value="early_reaction">Early Reaction Signal</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>New Value</div>
            <select 
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {variable === 'partner_channel' && (
                <>
                  <option value="high_engagement">High Engagement</option>
                  <option value="low_engagement">Low Engagement</option>
                </>
              )}
              {variable === 'product_offer' && (
                <option value="premium_offer">Premium Offer</option>
              )}
              {variable === 'early_reaction' && (
                <>
                  <option value="high_response">High Response</option>
                  <option value="low_response">Low Response</option>
                </>
              )}
            </select>
          </div>
          
          <button className="btn btn-primary" onClick={handleRunSimulation}>
            Simulate Customer
          </button>
          <button className="btn btn-outline" onClick={handleRunAll}>
            Simulate All
          </button>
        </div>
      </div>

      {/* Single Customer Result */}
      {results.length > 0 && selectedCustomer && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="section-title">
            Simulation Result: {selectedCustomer.name}
          </div>
          {(() => {
            const lastResult = results[results.length - 1]
            return (
              <div className="simulation-result">
                <div className="simulation-comparison">
                  <div className="detail-label">Base Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lastResult.baseScore}</div>
                </div>
                <div className="simulation-comparison">
                  <div className="detail-label">Simulated Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lastResult.overallScore}</div>
                </div>
                <div className="simulation-comparison" style={{ gridColumn: 'span 2' }}>
                  <div className="detail-label">Delta</div>
                  <div className={`simulation-delta ${lastResult.delta >= 0 ? 'delta-positive' : 'delta-negative'}`}>
                    {lastResult.delta >= 0 ? '+' : ''}{lastResult.delta}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Action: {lastResult.baseScore >= 75 ? 'push now' : 'nurture'} → {lastResult.action}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* All Customers Results */}
      {results.length > 1 && (
        <div className="card">
          <div className="section-title">Portfolio Simulation Results</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Base Score</th>
                  <th>Simulated Score</th>
                  <th>Delta</th>
                  <th>Base Action</th>
                  <th>Simulated Action</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 10).map(result => {
                  const customer = customers.find(c => c.id === result.customerId)
                  if (!customer) return null
                  
                  return (
                    <tr key={customer.id}>
                      <td style={{ fontWeight: 500 }}>{customer.name}</td>
                      <td>{result.baseScore}</td>
                      <td style={{ fontWeight: 600 }}>{result.overallScore}</td>
                      <td className={result.delta >= 0 ? 'delta-positive' : 'delta-negative'} style={{ fontWeight: 600 }}>
                        {result.delta >= 0 ? '+' : ''}{result.delta}
                      </td>
                      <td>{result.baseScore >= 75 ? 'push now' : result.baseScore >= 50 ? 'nurture' : 'hold'}</td>
                      <td>
                        <span className={`badge ${
                          result.action === 'push now' ? 'badge-success' :
                          result.action === 'nurture' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {result.action}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Governance Disclosure */}
      <div className="disclosure">
        ⚠️ Simulation uses modified alternative data based on approved variables only: partner/channel, product/offer, early reaction.
      </div>
    </div>
  )
}
