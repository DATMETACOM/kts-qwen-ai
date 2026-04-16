import { useState } from 'react'
import { getAllCustomers, runSimulation, getHeroCase } from '../dataProvider'
import { SimulationResult } from '../lib/scoring'

export default function Simulation() {
  const customers = getAllCustomers()
  const heroCase = getHeroCase()
  const [selectedCustomerId, setSelectedCustomerId] = useState(heroCase.id)
  const [variable, setVariable] = useState<'partner_channel' | 'product_offer' | 'early_reaction'>('partner_channel')
  const [newValue, setNewValue] = useState('high_engagement')
  const [results, setResults] = useState<SimulationResult[]>([])

  function toActionLabel(action: string): string {
    if (action === 'push now') return 'Uu tien tiep can'
    if (action === 'nurture') return 'Cham soc dinh ky'
    return 'Chua du dieu kien'
  }

  function handleRunSimulation() {
    const result = runSimulation(selectedCustomerId, variable, newValue)
    if (result) {
      setResults((prev) => [...prev, result])
    }
  }

  function handleRunAll() {
    const newResults: SimulationResult[] = []
    customers.forEach((customer) => {
      const result = runSimulation(customer.id, variable, newValue)
      if (result) newResults.push(result)
    })
    setResults(newResults)
  }

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  return (
    <div className="container">
      <div className="section-title">Phan tich gia dinh</div>
      <div className="section-subtitle">
        Phan tich gia dinh theo 3 bien: kenh tiep can, dieu kien san pham, tin hieu chuyen doi som
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="detail-layout">
          <div>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Khach hang</div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} (Lead Score: {c.scoring.overallScore})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Bien gia dinh</div>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value as any)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option value="partner_channel">Muc do tuong tac kenh tiep can</option>
              <option value="product_offer">Dieu kien san pham de xuat</option>
              <option value="early_reaction">Tin hieu chuyen doi som</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Gia tri gia dinh</div>
            <select
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {variable === 'partner_channel' && (
                <>
                  <option value="high_engagement">Tuong tac cao</option>
                  <option value="low_engagement">Tuong tac thap</option>
                </>
              )}
              {variable === 'product_offer' && <option value="premium_offer">De xuat uu dai cao</option>}
              {variable === 'early_reaction' && (
                <>
                  <option value="high_response">Phan hoi cao</option>
                  <option value="low_response">Phan hoi thap</option>
                </>
              )}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleRunSimulation}>
            Chay cho khach da chon
          </button>
          <button className="btn btn-outline" onClick={handleRunAll}>
            Chay toan danh muc
          </button>
        </div>
      </div>

      {results.length > 0 && selectedCustomer && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="section-title">
            Ket qua phan tich gia dinh: {selectedCustomer.name}
          </div>
          {(() => {
            const lastResult = results[results.length - 1]
            return (
              <div className="simulation-result">
                <div className="simulation-comparison">
                  <div className="detail-label">Diem goc</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lastResult.baseScore}</div>
                </div>
                <div className="simulation-comparison">
                  <div className="detail-label">Diem sau gia dinh</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{lastResult.overallScore}</div>
                </div>
                <div className="simulation-comparison" style={{ gridColumn: 'span 2' }}>
                  <div className="detail-label">Delta</div>
                  <div className={`simulation-delta ${lastResult.delta >= 0 ? 'delta-positive' : 'delta-negative'}`}>
                    {lastResult.delta >= 0 ? '+' : ''}{lastResult.delta}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Khuyen nghi xu ly: {toActionLabel(selectedCustomer.scoring.action)} -&gt; {toActionLabel(lastResult.action)}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {results.length > 1 && (
        <div className="card">
          <div className="section-title">Ket qua gia dinh danh muc</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Khach hang</th>
                  <th>Diem goc</th>
                  <th>Diem sau gia dinh</th>
                  <th>Delta</th>
                  <th>Khuyen nghi goc</th>
                  <th>Khuyen nghi sau gia dinh</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 10).map((result) => {
                  const customer = customers.find((c) => c.id === result.customerId)
                  if (!customer) return null

                  return (
                    <tr key={customer.id}>
                      <td style={{ fontWeight: 500 }}>{customer.name}</td>
                      <td>{result.baseScore}</td>
                      <td style={{ fontWeight: 600 }}>{result.overallScore}</td>
                      <td className={result.delta >= 0 ? 'delta-positive' : 'delta-negative'} style={{ fontWeight: 600 }}>
                        {result.delta >= 0 ? '+' : ''}{result.delta}
                      </td>
                      <td>{toActionLabel(customer.scoring.action)}</td>
                      <td>
                        <span className={`badge ${
                          result.action === 'push now' ? 'badge-success' :
                          result.action === 'nurture' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {toActionLabel(result.action)}
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

      <div className="disclosure">
        Luu y he thong: AI chi dong vai tro khuyen nghi. Quyet dinh cap tin dung thuoc tham quyen cua can bo Shinhan.
      </div>
    </div>
  )
}
