import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import MainSite from './pages/MainSite';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import AiCoachDashboard from './pages/AiCoachDashboard';
import ExerciseCatalog from './pages/ExerciseCatalog';
import ExerciseDetail from './pages/ExerciseDetail';
import ActiveWorkoutSession from './pages/ActiveWorkoutSession';
import WorkoutSummary from './pages/WorkoutSummary';
import WorkoutHistory from './pages/WorkoutHistory';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <Routes>
            {/* Landing & Public Pages */}
            <Route path="/" element={<MainSite />} />
            <Route path="/ai-coach" element={<AiCoachDashboard />} />
            <Route path="/exercises" element={<ExerciseCatalog />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            
            {/* AI Active Workout Studio & Summaries */}
            <Route path="/workout/active/:id" element={<ActiveWorkoutSession />} />
            <Route path="/workout/summary/:sessionId" element={<WorkoutSummary />} />
            <Route path="/workout/history" element={<WorkoutHistory />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Admin Management */}
            <Route 
              path="/glf-admin-panel" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            {/* Fallback to main landing page */}
            <Route path="*" element={<MainSite />} />
          </Routes>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
