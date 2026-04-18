import { useState } from "react";
import CourseCard from "@/components/shared/CourseCard";
import AddCourseDialog from "@/components/courses/AddCourseDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const initialCourses = [
  { title: "Développement des applications mobiles", instructor: "Prof. Bahri", progress: 65, lessons: 12, duration: "8h" },
  { title: "Administration des bases de données", instructor: "M. Riyami", progress: 40, lessons: 10, duration: "6h" },
  { title: "Gestion de projet C/TD/TP", instructor: "Prof. Idrissi Kaitouni", progress: 80, lessons: 8, duration: "5h" },
  { title: "JEE (C/TD/TP/P)", instructor: "Mme Zaoui", progress: 25, lessons: 15, duration: "10h" },
  { title: "Anglais 8", instructor: "Prof. Benitto", progress: 90, lessons: 6, duration: "3h" },
  { title: "Français 8", instructor: "Prof. Rzaini", progress: 55, lessons: 6, duration: "3h" },
  { title: "Architecture des SI", instructor: "Prof. Bouaine", progress: 30, lessons: 9, duration: "7h" },
  { title: "Sécurité dans les SI", instructor: "Prof. Khalid", progress: 10, lessons: 11, duration: "8h" },
];

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState(initialCourses);
  const [open, setOpen] = useState(false);
  const isTeacher = user?.role === "teacher";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Mes Cours</h1>
          <p className="text-muted-foreground">Tous vos cours disponibles.</p>
        </div>
        {isTeacher && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter un cours
          </Button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((c) => (
          <CourseCard key={c.title} {...c} onFavorite={() => {}} />
        ))}
      </div>
      {isTeacher && (
        <AddCourseDialog
          open={open}
          onOpenChange={setOpen}
          onCreated={(course) => {
            setCourses((prev) => [
              {
                title: course.title,
                instructor: user?.name ?? "Enseignant",
                progress: 0,
                lessons: 1,
                duration: "—",
              },
              ...prev,
            ]);
          }}
        />
      )}
    </div>
  );
};

export default Courses;
