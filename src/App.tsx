import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Shop from "./pages/Shop";
import Apply from "./pages/Apply";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Tournaments from "./pages/Tournaments";
import DiscordCallback from "./pages/DiscordCallback";
import EpicCallback from "./pages/EpicCallback";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/auth/discord/callback" element={<DiscordCallback />} />
              <Route path="/epic-callback" element={<EpicCallback />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
