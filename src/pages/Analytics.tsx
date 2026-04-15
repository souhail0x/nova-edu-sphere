import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const progressData = [
  { name: "Mobile", progress: 65 },
  { name: "BDD", progress: 40 },
  { name: "Gestion", progress: 80 },
  { name: "JEE", progress: 25 },
  { name: "Anglais", progress: 90 },
  { name: "Français", progress: 55 },
];

const gradesData = [
  { month: "Jan", grade: 14 },
  { month: "Fév", grade: 13.5 },
  { month: "Mar", grade: 15 },
  { month: "Avr", grade: 16 },
];

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Analytiques</h1>
      <p className="text-muted-foreground">Suivez votre progression et vos résultats.</p>
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-heading font-semibold mb-4">Progression par cours</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="progress" fill="hsl(36 90% 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-heading font-semibold mb-4">Évolution des notes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={gradesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="grade" stroke="hsl(220 70% 15%)" strokeWidth={2} dot={{ fill: "hsl(36 90% 55%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-card border rounded-xl p-5">
      <h3 className="font-heading font-semibold mb-4">Résultats récents</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left">
            <th className="pb-2 font-medium text-muted-foreground">Évaluation</th>
            <th className="pb-2 font-medium text-muted-foreground">Note</th>
            <th className="pb-2 font-medium text-muted-foreground">Remarque</th>
          </tr></thead>
          <tbody className="divide-y">
            <tr><td className="py-2.5">Quiz - BDD</td><td className="py-2.5 font-semibold">17/20</td><td className="py-2.5 text-muted-foreground">Excellent travail</td></tr>
            <tr><td className="py-2.5">Examen - Mobile</td><td className="py-2.5 font-semibold">14.5/20</td><td className="py-2.5 text-muted-foreground">Bon niveau, attention aux détails</td></tr>
            <tr><td className="py-2.5">Quiz - Gestion</td><td className="py-2.5 font-semibold">16/20</td><td className="py-2.5 text-muted-foreground">Très bien</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Analytics;
