import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { OnboardingProvider } from "../../contexts/identity-profile/context/OnboardingContext";
import OnboardingLayout from "../../contexts/identity-profile/layouts/OnboardingLayout";
import Login from "../../contexts/identity-profile/pages/Login";
import OnboardingIdentityPage from "../../contexts/identity-profile/pages/OnboardingIdentityPage";
import OnboardingLifestylePage from "../../contexts/identity-profile/pages/OnboardingLifestylePage";
import OnboardingSocialProfilePage from "../../contexts/identity-profile/pages/OnboardingSocialProfilePage";
import OnboardingFinancialExpectationPage from "../../contexts/identity-profile/pages/OnboardingFinancialExpectationPage";
import { WelcomePage } from "../../contexts/matchmaking/pages/WelcomePage";
import { MatchmakingDashboardPage } from "../../contexts/matchmaking/pages/MatchmakingDashboardPage";
import { PublishDepartmentPage } from "../../contexts/matchmaking/pages/PublishDepartmentPage";
import { ExploreSpacesPage } from "../../contexts/matchmaking/pages/ExploreSpacesPage";
import { MySpacesPage } from "../../contexts/matchmaking/pages/MySpacesPage";
import { JoinRequestsPage } from "../../contexts/matchmaking/pages/JoinRequestsPage";
import { ProfileSettingsPage } from "../../contexts/identity-profile/pages/ProfileSettingsPage";
import { InboxPage } from "../../contexts/matchmaking/pages/InboxPage";
import { AuthDispatcher } from "./AuthDispatcher";
import { AxiosInterceptor } from "./AxiosInterceptor";
import { MainLayout } from "../../shared/layouts/MainLayout";
import { FinanceDashboardPage } from "../../contexts/finances/pages/FinanceDashboardPage";
import { RoomieProvider } from "../../contexts/roomie/RoomieContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useKindeAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useKindeAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dispatcher" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AxiosInterceptor>
        <RoomieProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dispatcher" replace />} />
            <Route
              path="/dispatcher"
              element={
                <ProtectedRoute>
                  <AuthDispatcher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/onboarding/*"
              element={
                <ProtectedRoute>
                  <OnboardingProvider>
                    <Routes>
                      <Route element={<OnboardingLayout />}>
                        <Route
                          index
                          element={<Navigate to="step-1" replace />}
                        />
                        <Route
                          path="step-1"
                          element={<OnboardingIdentityPage />}
                        />
                        <Route
                          path="step-2"
                          element={<OnboardingLifestylePage />}
                        />
                        <Route
                          path="step-3"
                          element={<OnboardingSocialProfilePage />}
                        />
                        <Route
                          path="step-4"
                          element={<OnboardingFinancialExpectationPage />}
                        />
                      </Route>
                    </Routes>
                  </OnboardingProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <WelcomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matchmaking"
              element={
                <ProtectedRoute>
                  <MatchmakingDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publish-department"
              element={
                <ProtectedRoute>
                  <PublishDepartmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explorar"
              element={
                <ProtectedRoute>
                  <ExploreSpacesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-publicaciones"
              element={
                <ProtectedRoute>
                  <MySpacesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solicitudes"
              element={
                <ProtectedRoute>
                  <JoinRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProfileSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mensajes"
              element={
                <ProtectedRoute>
                  <InboxPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finanzas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <FinanceDashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </RoomieProvider>
      </AxiosInterceptor>
    </BrowserRouter>
  );
}

export default App;
