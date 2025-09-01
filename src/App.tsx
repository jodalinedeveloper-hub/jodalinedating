import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Chats from "./pages/Chats";
import Premium from "./pages/Premium";
import Profile from "./pages/Profile";
import ChatDetail from "./pages/ChatDetail";
import { SessionContextProvider, useAuth } from "./contexts/SessionContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const isAuthenticated = !!session;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/explore" /> : <Index />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/explore" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/explore" /> : <Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/chats/:chatId" element={<ChatDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SessionContextProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;