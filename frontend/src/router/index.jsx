import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Landing from "@/pages/public/Landing";
import NotFound from "@/pages/public/NotFound";

import StudentDashboard from "@/pages/studentdashboard/index.jsx";
import AdminDashboard from "@/pages/admindashboard/index.jsx";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/studentdashboard",
    element: (
      <ProtectedRoute>
        <RoleRoute allowed={["student"]}>
          <DashboardLayout>
            <StudentDashboard />
          </DashboardLayout>
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admindashboard",
    element: (
      <ProtectedRoute>
        <RoleRoute allowed={["admin"]}>
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}