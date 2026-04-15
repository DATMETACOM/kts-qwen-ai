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
            <h1>🎯 SF8</h1>
            <span className="header-badge">AI Customer Behavior Prediction</span>
            <span className="header-badge">PoC Demo</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/simulation" className={({ isActive }) => isActive ? 'active' : ''}>
              Simulation
            </NavLink>
            <NavLink to="/export" className={({ isActive }) => isActive ? 'active' : ''}>
              Export / Pitch
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
