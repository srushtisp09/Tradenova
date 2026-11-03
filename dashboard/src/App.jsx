import { Routes, Route } from 'react-router-dom';
import { TradingProvider } from './context/TradingContext';
import { TrackProvider } from './context/TrackContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/Overview';
import Holdings from './pages/Holdings';
import Positions from './pages/Positions';
import Watchlist from './pages/Watchlist';
import Orders from './pages/Orders';
import Learn from './pages/Learn';
import Insights from './pages/Insights';
import Design from './pages/Design';

export default function App() {
  return (
    <TrackProvider>
      <TradingProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="learn" element={<Learn />} />
            <Route path="insights" element={<Insights />} />
            <Route path="holdings" element={<Holdings />} />
            <Route path="positions" element={<Positions />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/design" element={<Design appName="TradeNova Dashboard" />} />
        </Routes>
      </TradingProvider>
    </TrackProvider>
  );
}
