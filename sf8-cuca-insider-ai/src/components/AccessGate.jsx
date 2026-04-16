import { useState } from "react";
import { LockKeyhole } from "lucide-react";

const ACCESS_PIN = (import.meta.env.VITE_ACCESS_PIN || "123567").trim();

export default function AccessGate({ children }) {
  const [pinInput, setPinInput] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (pinInput.trim() === ACCESS_PIN) {
      setAuthorized(true);
      setError("");
      return;
    }
    setError("Mã truy cập không hợp lệ. Vui lòng kiểm tra và thử lại.");
  }

  if (authorized) return children;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full bg-slate-900 p-2 text-white">
            <LockKeyhole size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Secure Access
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Onsite Access Control</h1>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Vui lòng nhập mã truy cập để vào hệ thống Cuca-Insider-AI.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700" htmlFor="access-pin">
            Access PIN
          </label>
          <input
            id="access-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pinInput}
            onChange={(event) => setPinInput(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 transition focus:ring"
            placeholder="Nhập mã truy cập"
            required
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Xác thực truy cập
          </button>
        </form>
      </section>
    </main>
  );
}
