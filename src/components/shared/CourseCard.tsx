import React from "react";
import { BookOpen, Clock, Heart } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  progress?: number;
  lessons: number;
  duration: string;
  image?: string;
  favorited?: boolean;
  onFavorite?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, instructor, progress, lessons, duration, favorited, onFavorite }) => (
  <div className="bg-card rounded-xl border overflow-hidden card-hover group">
    <div className="h-36 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center relative">
      <BookOpen className="h-12 w-12 text-primary-foreground/30" />
      {onFavorite && (
        <button onClick={onFavorite} className="absolute top-3 right-3 p-1.5 rounded-full bg-card/20 backdrop-blur hover:bg-card/40 transition">
          <Heart className={`h-4 w-4 ${favorited ? "fill-accent text-accent" : "text-primary-foreground/70"}`} />
        </button>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{instructor}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{lessons} leçons</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{duration}</span>
      </div>
      {progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CourseCard;
