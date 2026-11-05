import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TradingProvider } from './context/TradingContext';
import { TrackProvider } from './context/TrackContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Overview from './pages/Overview';
import Holdings from './pages/Holdings';
import Positions from './pages/Positions';
import Watchlist from './pages/Watchlist';
import Orders from './pages/Orders';
import Learn from './pages/Learn';
import Insights from './pages/Insights';
import Design from './pages/Design';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <TrackProvider>
        <TradingProvider>
          <Routes>
            {/* Public auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/design" element={<Design appName="TradeNova Dashboard" />} />

            {/* Protected dashboard pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="learn" element={<Learn />} />
                <Route path="insights" element={<Insights />} />
                <Route path="holdings" element={<Holdings />} />
                <Route path="positions" element={<Positions />} />
                <Route path="watchlist" element={<Watchlist />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Route>
          </Routes>
        </TradingProvider>
      </TrackProvider>
    </AuthProvider>
  );
}
