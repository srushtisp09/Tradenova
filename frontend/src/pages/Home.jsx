import { Cursor } from '../components/ui';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import MarketTicker from '../components/landing/MarketTicker';
import Sphere from '../components/landing/Sphere';
import Paths from '../components/landing/Paths';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Support from '../components/landing/Support';
import OpenAccount from '../components/landing/OpenAccount';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <MarketTicker />
        <Sphere />
        <Paths />
        <Features />
        <Pricing />
        <Support />
        <OpenAccount />
      </main>
      <Footer />
    </>
  );
}
