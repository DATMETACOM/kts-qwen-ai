import { useState } from 'react'
import { getHeroCase, getAllCustomers, getExportData } from '../dataProvider'

function toActionLabel(action: string): string {
  if (action === 'push now') return 'Uu tien tiep can'
  if (action === 'nurture') return 'Cham soc dinh ky'
  return 'Chua du dieu kien'
}

export default function ExportPitch() {
  const heroCase = getHeroCase()
  const allCustomers = getAllCustomers()
  const [selectedId, setSelectedId] = useState(heroCase.id)

  const exportData = getExportData(selectedId)
  if (!exportData) return <div className="container">Khong co du lieu</div>

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
      <div className="section-title">Bao cao nop bai</div>
      <div className="section-subtitle">
        Bao cao tong hop phuc vu pitch va danh gia giam khao
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
              Chon ho so khach hang
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              {allCustomers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} (Lead Score: {c.scoring.overallScore})</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handlePrint}>
            In / Luu PDF
          </button>
        </div>
      </div>

      <div className="export-card">
        <div className="export-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>
              (SF8) Cuca-Insider-AI - Bao cao ho so khach hang
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Shinhan Ops CRM | Phan tich & Khuyen nghi (PoC)
            </div>
          </div>
          <div className="badge badge-info">Generated Demo Data</div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            Tong quan ho so (Customer 360)
          </h3>
          <div className="detail-layout">
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Khach hang</div>
                <div className="detail-value">{customer.name}</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Do tuoi</div>
                <div className="detail-value">{customer.age}</div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Nghe nghiep</div>
                <div className="detail-value">{customer.occupation}</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="detail-label">Thu nhap khai bao</div>
                <div className="detail-value">{(customer.income / 1000000).toFixed(1)}M VND/thang</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            De xuat xu ly va NBO
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Diem tiem nang (Lead Score)</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(score.overallScore) }}>
                {score.overallScore}/100
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">San pham de xuat (NBO)</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb' }}>
                {product.name}
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Khuyen nghi xu ly</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className={`badge ${getActionBadge(score.action)}`}>{toActionLabel(score.action)}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Cau phan bo diem</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Kenh tiep can</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.pcf}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hanh vi</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.bss}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tin hieu chuyen doi</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.erq}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Phu hop san pham</div>
                <div style={{ fontWeight: 600 }}>{score.breakdown.pa}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem', color: '#1e40af' }}>
              Tom tat ho so & De xuat phuong an xu ly
            </div>
            <div style={{ lineHeight: 1.6 }}>{explanation}</div>
          </div>

          <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>
            <div className="detail-label" style={{ marginBottom: '0.5rem', color: '#166534' }}>
              Ghi chu tiep can khach hang
            </div>
            <div style={{ lineHeight: 1.6 }}>
              Uu tien tiep can <strong>{customer.name}</strong> voi san pham <strong>{product.name}</strong>.
              Nhan vien can doi chieu dieu kien thu nhap, KYC va quy trinh tham dinh truoc khi de xuat ho so.
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            Tong hop tin hieu Alternative Data
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Telco</div>
              <div style={{ fontSize: '0.875rem' }}>
                {(customer.alternativeData.telco.monthlySpend / 1000000).toFixed(2)}M/thang | {customer.alternativeData.telco.tenure} thang
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Vi dien tu</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.eWallet.usage} | {customer.alternativeData.eWallet.monthlyTransactions} giao dich/thang
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Thuong mai dien tu</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.ecommerce.monthlyOrders} don/thang | {(customer.alternativeData.ecommerce.avgOrderValue / 1000000).toFixed(2)}M/don
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="detail-label">Social</div>
              <div style={{ fontSize: '0.875rem' }}>
                {customer.alternativeData.social.activity} | {customer.alternativeData.social.interests.length} nhom quan tam
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="disclosure">
        Luu y he thong: AI chi dong vai tro khuyen nghi. Quyet dinh cap tin dung thuoc tham quyen cua can bo Shinhan.
      </div>
    </div>
  )
}
