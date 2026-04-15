import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-32">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-info rounded-full blur-3xl" />
    </div>
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-sidebar-accent/50 px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="h-2 w-2 bg-accent rounded-full animate-pulse" />
            Platform E-Learning IGA
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Apprenez sans
            <span className="text-accent"> limites</span>,
            réussissez avec
            <span className="text-accent"> excellence</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
            Accédez à des cours de qualité, des examens interactifs et une communauté dynamique. Votre réussite académique commence ici.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Commencer <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-2 border border-primary-foreground/30 px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
              <Play className="h-4 w-4" /> Voir la démo
            </button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
          <div className="relative">
            <div className="bg-sidebar-accent/30 rounded-2xl p-8 backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "500+", label: "Cours" },
                  { value: "50+", label: "Professeurs" },
                  { value: "2000+", label: "Étudiants" },
                  { value: "95%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-primary/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-heading font-bold text-accent">{stat.value}</p>
                    <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
