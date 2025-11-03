import Hero from "../sections/landing/hero";
import Journey from "../sections/landing/journey";
import PricingSection from "../sections/landing/pricing";
import AIAdvantageSection from "../sections/landing/aiAdvantage";

// --- Main Content Component (Faithful to Image) ---
const Landing = () => (
  <main className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-6">
    {/* 1. Hero Section */}
    <Hero />

    {/* 2. Your Journey Section */}
    <Journey />

    {/* 3. Premium Section (Pricing) */}
    <PricingSection />

    {/* 4. AI Advantage Section */}
    <AIAdvantageSection />
  </main>
);

export default Landing;
