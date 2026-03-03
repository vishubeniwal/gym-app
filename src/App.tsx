import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { MembersList } from './pages/MembersList';
import { MemberDetail } from './pages/MemberDetail';
import { MemberForm } from './pages/MemberForm';
import { PlansList } from './pages/PlansList';
import { PlanForm } from './pages/PlanForm';
import { Scan } from './pages/Scan';
import { Settings } from './pages/Settings';
import { DietPlans } from './pages/DietPlans';
import { DietPlanForm } from './pages/DietPlanForm';
import { useApp } from './contexts/AppContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { workspace, loading } = useApp();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!workspace) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/add"
            element={
              <ProtectedRoute>
                <MemberForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <MemberDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id/edit"
            element={
              <ProtectedRoute>
                <MemberForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/plans"
            element={
              <ProtectedRoute>
                <PlansList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/plans/add"
            element={
              <ProtectedRoute>
                <PlanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-plans"
            element={
              <ProtectedRoute>
                <DietPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-plans/add"
            element={
              <ProtectedRoute>
                <DietPlanForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
