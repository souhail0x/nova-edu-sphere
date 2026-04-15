import CourseCard from "@/components/shared/CourseCard";
import { Heart } from "lucide-react";

const favorites = [
  { title: "Développement des applications mobiles", instructor: "Prof. Bahri", progress: 65, lessons: 12, duration: "8h" },
  { title: "Gestion de projet C/TD/TP", instructor: "Prof. Idrissi Kaitouni", progress: 80, lessons: 8, duration: "5h" },
];

const Favorites = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Favoris</h1>
      <p className="text-muted-foreground">Vos cours et quiz sauvegardés.</p>
    </div>
    {favorites.length === 0 ? (
      <div className="text-center py-16">
        <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Aucun favori pour le moment.</p>
      </div>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((c) => (
          <CourseCard key={c.title} {...c} favorited onFavorite={() => {}} />
        ))}
      </div>
    )}
  </div>
);

export default Favorites;
