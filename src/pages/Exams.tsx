import { useState } from "react";
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

import AddAssessmentDialog from "@/components/exams/AddAssessmentDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const initialExams = [
  { title: "Examen Final - JEE", date: "28 Avril 2026", duration: "2h", status: "upcoming" },
  { title: "Quiz - Bases de données", date: "22 Avril 2026", duration: "30min", status: "upcoming" },
  { title: "Quiz - Gestion de projet", date: "18 Avril 2026", duration: "20min", status: "completed", score: "85%" },
  { title: "Examen mi-parcours - Mobile", date: "10 Avril 2026", duration: "1h30", status: "completed", score: "72%" },
];

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState(initialExams);
  const [open, setOpen] = useState(false);

  const canCreateAssessment = user?.role === "teacher" || user?.role === "admin" || user?.role === "moderator";

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Examens & Quiz</h1>
            <p className="text-muted-foreground">Vos évaluations à venir et passées.</p>
          </div>

          {canCreateAssessment && (
            <Button onClick={() => setOpen(true)} className="sm:self-start">
              <Plus className="h-4 w-4" />
              Ajouter Quiz / Examen
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {exams.map((e) => (
            <div key={e.title} className="bg-card border rounded-xl p-4 flex items-center justify-between card-hover">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${e.status === "completed" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                  {e.status === "completed" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm">{e.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{e.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.duration}</span>
                  </div>
                </div>
              </div>
              {e.status === "completed" ? (
                <span className="text-sm font-semibold text-success">{"score" in e ? e.score : "—"}</span>
              ) : (
                <button className="bg-accent text-accent-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Commencer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <AddAssessmentDialog
        open={open}
        onOpenChange={setOpen}
        onPublished={(assessment) => {
          setExams((current) => [
            {
              title: assessment.title,
              date: "Aujourd'hui",
              duration: assessment.duration,
              status: "upcoming",
            },
            ...current,
          ]);
        }}
      />
    </>
  );
};

export default Exams;
