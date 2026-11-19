import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Shield } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 bg-slate-50/50">
        <div className="card p-8 flex flex-col items-center gap-4 text-center max-w-sm shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Verifying Clinician Session</h3>
            <p className="text-xs text-slate-500 mt-1">
              Checking encrypted authentication token and permissions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
