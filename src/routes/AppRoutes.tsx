import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { LoginPage } from "../modules/auth/components/LoginPage";
import { RegisterPage } from "../modules/auth/components/RegisterPage";
import { DashboardPage } from "../modules/dashboard/components/DashboardPage";
import { AboutPage } from "../modules/dashboard/components/AboutPage";
import { ConnectionsPage } from "../modules/connections/components/ConnectionsPage";
import { ContactsPage } from "../modules/contacts/components/ContactsPage";
import { MessagesPage } from "../modules/messages/components/MessagesPage";
import { Layout } from "../pages/Layout";
import { useMessageScheduler } from "../modules/messages/hooks/useMessageScheduler";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  useMessageScheduler();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/connections/:id" element={<ContactsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};
