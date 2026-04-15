import { useState } from "react";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const students = [
  { id: 1, name: "Ahmed Benali", email: "ahmed@iga.ma", avg: 15.2 },
  { id: 2, name: "Fatima Zahra", email: "fatima@iga.ma", avg: 17.1 },
  { id: 3, name: "Omar Khalil", email: "omar@iga.ma", avg: 12.8 },
  { id: 4, name: "Sara Alaoui", email: "sara@iga.ma", avg: 14.5 },
  { id: 5, name: "Yassine Mansouri", email: "yassine@iga.ma", avg: 16.3 },
];

const studentData: Record<number, { progress: { name: string; progress: number }[]; grades: { month: string; grade: number }[]; results: { eval: string; note: string; remark: string }[] }> = {
  1: {
    progress: [{ name: "Mobile", progress: 65 }, { name: "BDD", progress: 40 }, { name: "JEE", progress: 25 }],
    grades: [{ month: "Jan", grade: 14 }, { month: "Fév", grade: 13.5 }, { month: "Mar", grade: 15 }, { month: "Avr", grade: 16 }],
    results: [{ eval: "Quiz - BDD", note: "17/20", remark: "Excellent" }, { eval: "Examen - Mobile", note: "14.5/20", remark: "Bon niveau" }],
  },
  2: {
    progress: [{ name: "Mobile", progress: 90 }, { name: "BDD", progress: 85 }, { name: "JEE", progress: 70 }],
    grades: [{ month: "Jan", grade: 16 }, { month: "Fév", grade: 17 }, { month: "Mar", grade: 17.5 }, { month: "Avr", grade: 18 }],
    results: [{ eval: "Quiz - BDD", note: "19/20", remark: "Excellent travail" }],
  },
  3: {
    progress: [{ name: "Mobile", progress: 35 }, { name: "BDD", progress: 50 }, { name: "JEE", progress: 20 }],
    grades: [{ month: "Jan", grade: 11 }, { month: "Fév", grade: 12 }, { month: "Mar", grade: 13 }, { month: "Avr", grade: 13.5 }],
    results: [{ eval: "Quiz - BDD", note: "12/20", remark: "Peut mieux faire" }, { eval: "Examen - Mobile", note: "10/20", remark: "À améliorer" }],
  },
  4: {
    progress: [{ name: "Mobile", progress: 55 }, { name: "BDD", progress: 60 }, { name: "JEE", progress: 45 }],
    grades: [{ month: "Jan", grade: 13 }, { month: "Fév", grade: 14 }, { month: "Mar", grade: 15 }, { month: "Avr", grade: 15.5 }],
    results: [{ eval: "Quiz - Gestion", note: "16/20", remark: "Très bien" }],
  },
  5: {
    progress: [{ name: "Mobile", progress: 80 }, { name: "BDD", progress: 75 }, { name: "JEE", progress: 60 }],
    grades: [{ month: "Jan", grade: 15 }, { month: "Fév", grade: 16 }, { month: "Mar", grade: 16.5 }, { month: "Avr", grade: 17 }],
    results: [{ eval: "Quiz - BDD", note: "18/20", remark: "Excellent" }, { eval: "Examen - Mobile", note: "15/20", remark: "Bon travail" }],
  },
};

const TeacherAnalytics = () => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  if (selectedStudent !== null) {
    const student = students.find((s) => s.id === selectedStudent)!;
    const data = studentData[selectedStudent];
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-1 text-sm text-accent hover:underline">
          <ChevronLeft className="h-4 w-4" /> Retour à la liste
        </button>
        <div>
          <h1 className="font-heading text-2xl font-bold">Analytiques - {student.name}</h1>
          <p className="text-muted-foreground">{student.email} · Moyenne: {student.avg}/20</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-heading font-semibold mb-4">Progression par cours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 20% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="progress" fill="hsl(43 72% 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-heading font-semibold mb-4">Évolution des notes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.grades}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 20% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="grade" stroke="hsl(217 75% 15%)" strokeWidth={2} dot={{ fill: "hsl(43 72% 47%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-heading font-semibold mb-4">Résultats</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="pb-2 font-medium text-muted-foreground">Évaluation</th><th className="pb-2 font-medium text-muted-foreground">Note</th><th className="pb-2 font-medium text-muted-foreground">Remarque</th></tr></thead>
            <tbody className="divide-y">
              {data.results.map((r, i) => (
                <tr key={i}><td className="py-2.5">{r.eval}</td><td className="py-2.5 font-semibold">{r.note}</td><td className="py-2.5 text-muted-foreground">{r.remark}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Analytiques Étudiants</h1>
        <p className="text-muted-foreground">Consultez la progression et les résultats de chaque étudiant.</p>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50 text-left"><th className="p-3 font-medium text-muted-foreground">Étudiant</th><th className="p-3 font-medium text-muted-foreground">Email</th><th className="p-3 font-medium text-muted-foreground">Moyenne</th><th className="p-3 font-medium text-muted-foreground">Action</th></tr></thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{s.name.charAt(0)}</div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{s.email}</td>
                <td className="p-3 font-semibold">{s.avg}/20</td>
                <td className="p-3">
                  <button onClick={() => setSelectedStudent(s.id)} className="text-accent hover:underline text-sm flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" /> Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
