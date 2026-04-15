import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const SLOTS = ["9h15-10h30", "10h45-12h", "12h30-13h45", "14h00-15h15", "15h30-16h45"];

type CalEvent = { day: number; slot: number; title: string; room: string; teacher: string; color: string };

const events: CalEvent[] = [
  { day: 0, slot: 3, title: "Dév. applications mobiles (C/TD/TP/P)", room: "4A-MRS", teacher: "BAHRI", color: "bg-accent/10 text-accent border-accent/30" },
  { day: 1, slot: 0, title: "Atelier en DLTI", room: "5C-MRS", teacher: "ZAOUI", color: "bg-info/10 text-info border-info/30" },
  { day: 1, slot: 1, title: "Anglais 8 (C/TD)", room: "2A-MRS", teacher: "Benitto", color: "bg-success/10 text-success border-success/30" },
  { day: 1, slot: 2, title: "Administration des BDD C/TD/TP", room: "5A-MRS", teacher: "M. RIYAMI", color: "bg-primary/10 text-primary border-primary/30" },
  { day: 2, slot: 0, title: "Gestion de projet C/TD/TP", room: "4B-CIM-MRS", teacher: "Idrissi Kaitouni", color: "bg-warning/10 text-warning border-warning/30" },
  { day: 2, slot: 2, title: "Français 8 (C/TD)", room: "2B-MRS", teacher: "RZAINI", color: "bg-success/10 text-success border-success/30" },
  { day: 3, slot: 0, title: "JEE (C/TD/TP/P)", room: "4A-MRS", teacher: "Mme Zaoui", color: "bg-destructive/10 text-destructive border-destructive/30" },
  { day: 3, slot: 3, title: "Projet tuteuré en DLTI", room: "3A-MRS", teacher: "Riyami/Zouir", color: "bg-info/10 text-info border-info/30" },
  { day: 3, slot: 4, title: "Sécurité dans les SI", room: "1A-MRS", teacher: "KHALID", color: "bg-primary/10 text-primary border-primary/30" },
  { day: 5, slot: 0, title: "Architecture des SI", room: "4A-MRS", teacher: "BOUAINE", color: "bg-accent/10 text-accent border-accent/30" },
];

const CalendarPage = () => {
  const [level, setLevel] = useState("4DLTI MRS");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Emploi du temps</h1>
          <p className="text-muted-foreground">2ème semestre 2026</p>
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 rounded-lg border bg-card text-sm">
          <option>4DLTI MRS</option>
          <option>3DLTI MRS</option>
          <option>2DLTI MRS</option>
        </select>
      </div>
      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="p-3 text-left font-medium text-muted-foreground w-20">J/H</th>
              {SLOTS.map((s) => <th key={s} className="p-3 text-center font-medium text-muted-foreground">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, di) => (
              <tr key={day} className="border-b last:border-b-0">
                <td className="p-3 font-heading font-semibold text-xs uppercase tracking-wide">{day}</td>
                {SLOTS.map((_, si) => {
                  const ev = events.find((e) => e.day === di && e.slot === si);
                  return (
                    <td key={si} className="p-2 h-24 align-top">
                      {ev ? (
                        <div className={`rounded-lg border p-2 h-full text-xs ${ev.color}`}>
                          <p className="font-semibold leading-tight">{ev.title}</p>
                          <p className="mt-1 opacity-70">{ev.room} · {ev.teacher}</p>
                        </div>
                      ) : (
                        <button className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarPage;
