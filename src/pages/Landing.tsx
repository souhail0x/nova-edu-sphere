import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";

const Landing = () => (
  <div className="min-h-screen">
    {/* Navbar */}
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur text-primary-foreground border-b border-sidebar-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-accent" />
          <span className="font-heading font-bold text-lg">IGA Learn</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-accent transition-colors">Fonctionnalités</a>
          <a href="#about" className="hover:text-accent transition-colors">À propos</a>
        </nav>
        <Link to="/login" className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Connexion
        </Link>
      </div>
    </header>

    <HeroSection />
    <div id="features"><FeaturesSection /></div>
    <CTASection />

    {/* Footer */}
    <footer className="bg-foreground text-background py-10">
      <div className="container text-center text-sm opacity-70">
        © 2026 IGA Learn. Tous droits réservés.
      </div>
    </footer>
  </div>
);

export default Landing;
