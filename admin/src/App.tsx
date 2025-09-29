import { Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  AuthPage,
  ThemedTitleV2,
} from "@refinedev/antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import {
  TeamOutlined,
  SafetyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { App as AntdApp, ConfigProvider, theme } from "antd";

import { authProvider } from "./providers/auth-provider";
import { dataProvider } from "./providers/data-provider";

// Pages
import { UserList, UserShow, UserEdit, UserCreate } from "./pages/users";
import { RoleList, RoleShow, RoleEdit, RoleCreate } from "./pages/roles";
import { HealthMonitor } from "./pages/health";
import { VerifyOtp } from "./pages/auth/verify-otp";
import { VerifyEmail } from "./pages/auth/verify-email";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 6,
            },
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: "users",
                  list: "/users",
                  show: "/users/show/:id",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  meta: {
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: "roles",
                  list: "/roles",
                  show: "/roles/show/:id",
                  create: "/roles/create",
                  edit: "/roles/edit/:id",
                  meta: {
                    icon: <SafetyOutlined />,
                  },
                },
                {
                  name: "health",
                  list: "/health",
                  meta: {
                    label: "Health Monitor",
                    icon: <HeartOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "nestjs-admin",
                title: {
                  text: "Admin Panel",
                  icon: <TeamOutlined />,
                },
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            text="Admin Panel"
                            icon={<TeamOutlined />}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<UserList />} />
                  
                  {/* Users */}
                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="show/:id" element={<UserShow />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                    <Route path="create" element={<UserCreate />} />
                  </Route>

                  {/* Roles */}
                  <Route path="/roles">
                    <Route index element={<RoleList />} />
                    <Route path="show/:id" element={<RoleShow />} />
                    <Route path="edit/:id" element={<RoleEdit />} />
                    <Route path="create" element={<RoleCreate />} />
                  </Route>

                  {/* Health */}
                  <Route path="/health" element={<HealthMonitor />} />


                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        title={
                          <ThemedTitleV2
                            collapsed={false}
                            text="Admin Panel"
                            icon={<TeamOutlined />}
                          />
                        }
                        formProps={{
                          initialValues: {
                            email: "",
                            password: "",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <AuthPage
                        type="register"
                        title={
                          <ThemedTitleV2
                            collapsed={false}
                            text="Admin Panel"
                            icon={<TeamOutlined />}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <AuthPage
                        type="forgotPassword"
                        title={
                          <ThemedTitleV2
                            collapsed={false}
                            text="Admin Panel"
                            icon={<TeamOutlined />}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/update-password"
                    element={
                      <AuthPage
                        type="updatePassword"
                        title={
                          <ThemedTitleV2
                            collapsed={false}
                            text="Admin Panel"
                            icon={<TeamOutlined />}
                          />
                        }
                      />
                    }
                  />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;