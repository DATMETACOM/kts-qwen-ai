import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import CustomerDetail from './views/CustomerDetail'
import Simulation from './views/Simulation'
import ExportPitch from './views/ExportPitch'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <h1>(SF8) Cuca-Insider-AI</h1>
            <span className="header-badge">Shinhan Ops CRM</span>
            <span className="header-badge">Phan tich & Khuyen nghi (PoC)</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Quan tri van hanh
            </NavLink>
            <NavLink to="/simulation" className={({ isActive }) => (isActive ? 'active' : '')}>
              Phan tich gia dinh
            </NavLink>
            <NavLink to="/export" className={({ isActive }) => (isActive ? 'active' : '')}>
              Bao cao nop bai
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/export" element={<ExportPitch />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
