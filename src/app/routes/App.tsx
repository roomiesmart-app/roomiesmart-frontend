import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from '../../contexts/identity-profile/context/OnboardingContext';
import OnboardingLayout from '../../contexts/identity-profile/layouts/OnboardingLayout';
import Login from '../../contexts/identity-profile/pages/Login';
import OnboardingIdentityPage from '../../contexts/identity-profile/pages/OnboardingIdentityPage';
import OnboardingLifestylePage from '../../contexts/identity-profile/pages/OnboardingLifestylePage'; 
import OnboardingSocialProfilePage from '../../contexts/identity-profile/pages/OnboardingSocialProfilePage';
import OnboardingFinancialExpectationPage from '../../contexts/identity-profile/pages/OnboardingFinancialExpectationPage';
import { WelcomeDashboardPage } from '../../contexts/matchmaking/pages/WelcomePage';
import { MatchmakingDashboardPage } from '../../contexts/matchmaking/pages/MatchmakingDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<WelcomeDashboardPage />} />
        <Route path="/matchmaking" element={<MatchmakingDashboardPage />} />

        <Route 
          path="/register/*" 
          element={
            <OnboardingProvider>
              <Routes>
                <Route element={<OnboardingLayout />}>
                  <Route index element={<Navigate to="/register/step-1" replace />} />
                  <Route path="step-1" element={<OnboardingIdentityPage />} />
                  <Route path="step-2" element={<OnboardingLifestylePage />} />
                  <Route path="step-3" element={<OnboardingSocialProfilePage />} />
                  <Route path="step-4" element={<OnboardingFinancialExpectationPage />} />
                </Route>
              </Routes>
            </OnboardingProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;