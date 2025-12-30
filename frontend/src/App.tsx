import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "./theme";
import { AuthProvider } from "./context/AuthProvider";
import { ROUTES } from "./config/routes";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Projects
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import CreateProject from "./pages/projects/CreateProject";

// Tasks
import Tasks from "./pages/tasks/Tasks";
import TaskDetails from "./pages/tasks/TaskDetails";
import CreateTask from "./pages/tasks/CreateTask";

// Teams
import Teams from "./pages/teams/Teams";
import TeamDetail from "./pages/teams/TeamDetail";
import CreateTeam from "./pages/teams/CreateTeam";

// Profile
import Profile from "./pages/profile/Profile";

// Layout
import Layout from "./components/layout/Layout";

// Not Found
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <ModalsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={<ForgotPassword />}
              />

              {/* Protected Routes with Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

                {/* Projects */}
                <Route path={ROUTES.PROJECTS} element={<Projects />} />
                <Route
                  path={ROUTES.CREATE_PROJECT}
                  element={<CreateProject />}
                />
                <Route path="/projects/:id" element={<ProjectDetails />} />

                {/* Tasks */}
                <Route path={ROUTES.TASKS} element={<Tasks />} />
                <Route path={ROUTES.CREATE_TASK} element={<CreateTask />} />
                <Route path="/tasks/:id" element={<TaskDetails />} />

                {/* Teams */}
                <Route path={ROUTES.TEAMS} element={<Teams />} />
                <Route path={ROUTES.CREATE_TEAM} element={<CreateTeam />} />
                <Route
                  path="/teams/:id"
                  element={
                    <ErrorBoundary>
                      <TeamDetail />
                    </ErrorBoundary>
                  }
                />

                {/* Profile */}
                <Route path={ROUTES.PROFILE} element={<Profile />} />
              </Route>

              {/* Root redirect */}
              <Route
                path={ROUTES.ROOT}
                element={<Navigate to={ROUTES.DASHBOARD} replace />}
              />

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
