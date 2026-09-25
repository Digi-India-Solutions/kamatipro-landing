"use client";

import "./kameti.css";
import TopBar from "../components/TopBar";
import HeroSection from "../components/HeroSection";
import ProblemSolutionSection from "../components/ProblemSolutionSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductOverviewSection from "../components/productoverview/ProductOverviewSection";
import CtaBand from "../components/CtaBand";
import HowItWorksSection from "../components/HowItWorksSection";
import TrustSection from "../components/TrustSection";
import FaqSection from "../components/FaqSection";
import DemoFormSection from "../components/DemoFormSection";
import FooterSection from "../components/FooterSection";
import StickyMobileBar from "../components/StickyMobileBar";
import DesktopWhatsApp from "../components/DesktopWhatsApp";
import LeadPopup from "../components/leadpopup/LeadPopup";

export default function Home() {
  return (
    <main>
      <TopBar />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <ProductOverviewSection />
      <CtaBand />
      <HowItWorksSection />
      <TrustSection />
      <FaqSection />
      <DemoFormSection />
      <FooterSection />
      <StickyMobileBar />
      <DesktopWhatsApp />
      <LeadPopup />
    </main>
  );
}