import { Link, Navigate, Route, Routes } from "react-router-dom";
import Reportes from "./pages/Reportes";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
          <Link
            to="/reportes"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Reportes
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/reportes" replace />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/reportes" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
