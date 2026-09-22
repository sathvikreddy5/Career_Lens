import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CareerReadiness from "./pages/CareerReadiness";
import OpportunitySafety from "./pages/OpportunitySafety";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import CareerProfile from "./pages/CareerProfile";
import JobReady from "./pages/JobReady";

import DashboardLayout from "./components/auth/dashboard/DashboardLayout";

import LearnSkill from "./pages/LearnSkill";
import Practice from "./pages/Practice";
import PracticeTask from "./pages/PracticeTask";

import AIAssistant from "./components/auth/ai/AIAssistant";

import { useAuth } from "./context/AuthContext";

// PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// PUBLIC ROUTE
const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED APP */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/job-ready" element={<JobReady />} />

          <Route path="/practice" element={<Practice />} />

          <Route
            path="/practice/:skillId/:taskIndex"
            element={<PracticeTask />}
          />

          <Route path="/learn/:skillId" element={<LearnSkill />} />

          <Route path="/career-profile" element={<CareerProfile />} />

          <Route path="/career-readiness" element={<CareerReadiness />} />

          <Route path="/opportunity-safety" element={<OpportunitySafety />} />

          <Route path="/history" element={<History />} />

          <Route path="/history/:id" element={<HistoryDetail />} />
        </Route>

        {/* DEFAULT */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* GLOBAL AI ASSISTANT */}
      {user && <AIAssistant />}
    </>
  );
};

export default App;
