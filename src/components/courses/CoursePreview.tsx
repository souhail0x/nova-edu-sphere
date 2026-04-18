import React from "react";
import { BookOpen, User } from "lucide-react";

interface CoursePreviewProps {
  title: string;
  chapter: string;
  content: string;
  instructor?: string;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({
  title,
  chapter,
  content,
  instructor,
}) => {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header — student-facing style */}
      <div className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80 mb-1">
          <BookOpen className="h-3.5 w-3.5" />
          Cours
        </div>
        <h1 className="font-heading text-xl font-bold leading-tight">{title}</h1>
        {instructor && (
          <div className="flex items-center gap-1.5 text-xs mt-2 opacity-90">
            <User className="h-3.5 w-3.5" />
            {instructor}
          </div>
        )}
      </div>

      {/* Chapter body */}
      <div className="p-5 max-h-[400px] overflow-y-auto">
        {chapter && (
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3 pb-2 border-b">
            {chapter}
          </h2>
        )}
        {content ? (
          <div
            lang="fr"
            className="prose prose-sm max-w-none prose-headings:font-heading prose-img:rounded-lg prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucun contenu pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default CoursePreview;
