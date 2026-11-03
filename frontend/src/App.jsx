import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Design from './pages/Design';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design" element={<Design appName="TradeNova" />} />
    </Routes>
  );
}
