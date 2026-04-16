import Dashboard from "./components/Dashboard.jsx";
import AccessGate from "./components/AccessGate.jsx";

export default function App() {
  return (
    <AccessGate>
      <Dashboard />
    </AccessGate>
  );
}
