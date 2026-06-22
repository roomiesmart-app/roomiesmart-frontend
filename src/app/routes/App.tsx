import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";import { OnboardingProvider } from "../../contexts/identity-profile/context/OnboardingContext";
import OnboardingLayout from "../../contexts/identity-profile/layouts/OnboardingLayout";
import Login from "../../contexts/identity-profile/pages/Login";
import OnboardingIdentityPage from "../../contexts/identity-profile/pages/OnboardingIdentityPage";
import OnboardingLifestylePage from "../../contexts/identity-profile/pages/OnboardingLifestylePage"; 
import OnboardingSocialProfilePage from "../../contexts/identity-profile/pages/OnboardingSocialProfilePage"; 
import OnboardingFinancialExpectationPage from "../../contexts/identity-profile/pages/OnboardingFinancialExpectationPage"
import {WelcomePage} from "../../contexts/matchmaking/pages/WelcomePage"
import { MatchmakingDashboardPage } from "../../contexts/matchmaking/pages/MatchmakingDashboardPage"
import { AuthDispatcher } from "./AuthDispatcher";
import { AxiosInterceptor } from "./AxiosInterceptor";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to="/dispatcher" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AxiosInterceptor>
        <Routes>
          <Route path="/" element={<Navigate to="/dispatcher" replace />} />
          <Route path="/dispatcher" element={<ProtectedRoute><AuthDispatcher /></ProtectedRoute>} />
          
          <Route 
            path="/sso-callback" 
            element={
              <AuthenticateWithRedirectCallback 
                signInForceRedirectUrl="/dispatcher" 
                signUpForceRedirectUrl="/dispatcher" 
              />
            } 
          />
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route 
            path="/onboarding/*" 
            element={
              <ProtectedRoute>
                <OnboardingProvider>
                  <Routes>
                    <Route element={<OnboardingLayout />}>
                      <Route index element={<Navigate to="step-1" replace />} />
                      <Route path="step-1" element={<OnboardingIdentityPage />} />
                      <Route path="step-2" element={<OnboardingLifestylePage />} />
                      <Route path="step-3" element={<OnboardingSocialProfilePage />} />
                      <Route path="step-4" element={<OnboardingFinancialExpectationPage />} />
                    </Route>
                  </Routes>
                </OnboardingProvider>
              </ProtectedRoute>
            } 
          />

          <Route path="/dashboard" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
          <Route path="/matchmaking" element={<ProtectedRoute><MatchmakingDashboardPage /></ProtectedRoute>} />
        </Routes>
      </AxiosInterceptor>
    </BrowserRouter>
  );
}

export default App;