import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import MainSite from './pages/MainSite';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ContentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainSite />} />
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
  );
}

export default App;
