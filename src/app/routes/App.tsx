import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from '../../contexts/identity-profile/context/OnboardingContext';
import Login from '../../contexts/identity-profile/pages/Login';
import OnboardingIdentityPage from '../../contexts/identity-profile/pages/OnboardingIdentityPage';
import OnboardingLifestylePage from '../../contexts/identity-profile/pages/OnboardingLifestylePage'; 
import OnboardingSocialProfilePage from '../../contexts/identity-profile/pages/OnboardingSocialProfilePage';
import OnboardingFinancialExpectationPage from '../../contexts/identity-profile/pages/OnboardingFinancialExpectationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/register/*" 
          element={
            <OnboardingProvider>
              <Routes>
                <Route index element={<Navigate to="/register/step-1" replace />} />
                <Route path="step-1" element={<OnboardingIdentityPage />} />
                <Route path="step-2" element={<OnboardingLifestylePage />} />
                <Route path="step-3" element={<OnboardingSocialProfilePage />} />
                <Route path="step-4" element={<OnboardingFinancialExpectationPage />} />
              </Routes>
            </OnboardingProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;