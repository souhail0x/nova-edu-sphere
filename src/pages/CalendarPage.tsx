import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const SLOTS = ["9h15-10h30", "10h45-12h", "12h30-13h45", "14h00-15h15", "15h30-16h45"];

type CalEvent = { day: number; slot: number; title: string; room: string; teacher: string; color: string };

const initialEvents: CalEvent[] = [
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

const typeColors: Record<string, string> = {
  Course: "bg-primary/10 text-primary border-primary/30",
  Exam: "bg-destructive/10 text-destructive border-destructive/30",
  Event: "bg-accent/10 text-accent border-accent/30",
};

const CalendarPage = () => {
  const [level, setLevel] = useState("4DLTI MRS");
  const [events, setEvents] = useState(initialEvents);
  const [modal, setModal] = useState<{ day: number; slot: number } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", time: "", type: "Course" });

  const openModal = (day: number, slot: number) => {
    setForm({ title: "", description: "", time: "", type: "Course" });
    setModal({ day, slot });
  };

  const handleSave = () => {
    if (!modal || !form.title.trim()) return;
    const newEvent: CalEvent = {
      day: modal.day,
      slot: modal.slot,
      title: form.title,
      room: form.description || "—",
      teacher: form.time || "—",
      color: typeColors[form.type] || typeColors.Course,
    };
    setEvents((prev) => [...prev, newEvent]);
    setModal(null);
  };

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
                        <button onClick={() => openModal(di, si)} className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-border/50 opacity-0 hover:opacity-100 hover:bg-secondary/30 transition-all">
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

      {/* Add Event Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="bg-card border rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="font-heading font-semibold text-lg">Ajouter un événement</h3>
                <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="text-xs text-muted-foreground">{DAYS[modal.day]} · {SLOTS[modal.slot]}</div>
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Nom du cours / examen / événement" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description / Salle</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Ex: 4A-MRS" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Enseignant / Heure</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Ex: Prof. Bahri" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option>Course</option>
                    <option>Exam</option>
                    <option>Event</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-5 border-t">
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border text-sm hover:bg-secondary transition-colors">Annuler</button>
                <button onClick={handleSave} disabled={!form.title.trim()} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">Enregistrer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;
