import { useAuth } from "@/context/AuthContext";
import { BookOpen, FileText, BarChart3, Users, GraduationCap } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import EventSlider from "@/components/shared/EventSlider";
import CourseCard from "@/components/shared/CourseCard";

const mockCourses = [
  { title: "Développement des applications mobiles", instructor: "Prof. Bahri", progress: 65, lessons: 12, duration: "8h" },
  { title: "Administration des bases de données", instructor: "M. Riyami", progress: 40, lessons: 10, duration: "6h" },
  { title: "Gestion de projet", instructor: "Prof. Idrissi Kaitouni", progress: 80, lessons: 8, duration: "5h" },
  { title: "JEE (C/TD/TP/P)", instructor: "Mme Zaoui", progress: 25, lessons: 15, duration: "10h" },
];

const StudentDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Bienvenue, Ahmed 👋</h1>
      <p className="text-muted-foreground">Voici votre tableau de bord.</p>
    </div>
    <EventSlider />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Cours inscrits" value={8} icon={BookOpen} trend="+2 ce mois" />
      <StatCard title="Quiz terminés" value={15} icon={FileText} />
      <StatCard title="Score moyen" value="78%" icon={BarChart3} />
      <StatCard title="Communautés" value={3} icon={Users} />
    </div>
    <div>
      <h2 className="font-heading font-semibold text-lg mb-4">Mes cours en cours</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockCourses.map((c) => (
          <CourseCard key={c.title} {...c} onFavorite={() => {}} />
        ))}
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Tableau de bord Enseignant</h1>
      <p className="text-muted-foreground">Gérez vos cours et suivez vos étudiants.</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Mes cours" value={6} icon={BookOpen} />
      <StatCard title="Étudiants" value={120} icon={GraduationCap} />
      <StatCard title="Examens créés" value={12} icon={FileText} />
      <StatCard title="Questions reçues" value={8} icon={Users} trend="3 nouvelles" />
    </div>
    <div>
      <h2 className="font-heading font-semibold text-lg mb-4">Cours récents</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCourses.slice(0, 3).map((c) => (
          <CourseCard key={c.title} {...c} />
        ))}
      </div>
    </div>
  </div>
);

const ModeratorDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Panel Modérateur</h1>
      <p className="text-muted-foreground">Gérez les communautés et les annonces.</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Communautés" value={5} icon={Users} />
      <StatCard title="Étudiants actifs" value={450} icon={GraduationCap} />
      <StatCard title="Annonces" value={12} icon={FileText} />
      <StatCard title="Événements" value={8} icon={BarChart3} />
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Administration</h1>
      <p className="text-muted-foreground">Supervision globale du système.</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Utilisateurs" value={580} icon={Users} trend="+25 ce mois" />
      <StatCard title="Cours actifs" value={42} icon={BookOpen} />
      <StatCard title="Enseignants" value={35} icon={GraduationCap} />
      <StatCard title="Taux d'activité" value="87%" icon={BarChart3} />
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case "student": return <StudentDashboard />;
    case "teacher": return <TeacherDashboard />;
    case "moderator": return <ModeratorDashboard />;
    case "admin": return <AdminDashboard />;
  }
};

export default Dashboard;
