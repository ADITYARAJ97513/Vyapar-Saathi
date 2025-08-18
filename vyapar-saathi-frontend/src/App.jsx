import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Home,
  Briefcase,
  ShoppingCart,
  Receipt,
  Users,
  Menu,
  X,
  Package,
  LogOut,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { setAuthToken } from "./services/api";
import DashboardPage from "./pages/DashboardPage";
import BillingPage from "./pages/BillingPage";
import ExpensesPage from "./pages/ExpensesPage";
import UdhaarPage from "./pages/UdhaarPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/footer";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/billing", icon: ShoppingCart, label: "Billing" },
    { path: "/products", icon: Package, label: "Products" },
    { path: "/expenses", icon: Receipt, label: "Expenses" },
    { path: "/udhaar", icon: Users, label: "Udhaar" },
  ];

  return (
    <>
      <nav className="hidden md:flex bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-orange-400" />
            <h1 className="text-xl font-bold">Vyapar Saathi</h1>
          </div>
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-orange-500"
                    : "hover:bg-blue-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <nav className="md:hidden bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-orange-400" />
            <h1 className="text-lg font-bold">Vyapar Saathi</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-blue-800"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-orange-500"
                    : "hover:bg-blue-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors bg-red-600 hover:bg-red-700 mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const MainLayout = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={onLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={<DashboardPage refreshTrigger={refreshTrigger} />}
          />
          <Route
            path="/billing"
            element={
              <BillingPage
                businessInfo={user.businessInfo}
                onSaleComplete={handleDataRefresh}
              />
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/expenses"
            element={<ExpensesPage onExpenseAdded={handleDataRefresh} />}
          />
          <Route path="/udhaar" element={<UdhaarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("vyaparSaathiUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setAuthToken(userData.token);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("vyaparSaathiUser", JSON.stringify(userData));
    setUser(userData);
    setAuthToken(userData.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("vyaparSaathiUser");
    setUser(null);
    setAuthToken(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <MainLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;