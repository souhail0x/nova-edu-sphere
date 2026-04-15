import { motion } from "framer-motion";
import { BookOpen, FileText, Users, BarChart3, Video, Calendar } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Cours Interactifs", desc: "Accédez à des cours structurés avec vidéos, PDFs et contenus riches." },
  { icon: FileText, title: "Examens & Quiz", desc: "Évaluez vos connaissances avec des quiz et examens interactifs." },
  { icon: Users, title: "Communauté", desc: "Rejoignez des groupes de discussion et partagez avec vos pairs." },
  { icon: BarChart3, title: "Analytiques", desc: "Suivez votre progression et vos résultats en temps réel." },
  { icon: Video, title: "Classes Live", desc: "Participez à des sessions en direct avec vos professeurs." },
  { icon: Calendar, title: "Calendrier", desc: "Organisez votre emploi du temps et ne manquez aucun événement." },
];

const FeaturesSection = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Une plateforme complète pour votre parcours académique.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 border card-hover"
          >
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <f.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
