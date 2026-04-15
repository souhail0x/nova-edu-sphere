import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-20 bg-primary text-primary-foreground">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container text-center">
      <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Prêt à commencer votre apprentissage ?</h2>
      <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">Rejoignez des milliers d'étudiants et commencez votre parcours dès aujourd'hui.</p>
      <Link to="/login" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg">
        Se connecter <ArrowRight className="h-5 w-5" />
      </Link>
    </motion.div>
  </section>
);

export default CTASection;
