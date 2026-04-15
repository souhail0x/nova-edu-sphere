import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const events = [
  { id: 1, title: "Semaine de la Technologie", date: "20-25 Avril 2026", desc: "Conférences et ateliers sur les nouvelles technologies." },
  { id: 2, title: "Hackathon IGA", date: "5 Mai 2026", desc: "48h pour créer une application innovante." },
  { id: 3, title: "Journée Portes Ouvertes", date: "15 Mai 2026", desc: "Découvrez nos formations et rencontrez nos équipes." },
];

const EventSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % events.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const ev = events[current];

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <button onClick={() => setCurrent((current - 1 + events.length) % events.length)} className="p-1 rounded-full hover:bg-primary-foreground/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center flex-1 px-4">
          <div className="inline-flex items-center gap-1.5 text-accent text-xs mb-2">
            <Calendar className="h-3 w-3" /> {ev.date}
          </div>
          <h3 className="font-heading font-bold text-lg mb-1">{ev.title}</h3>
          <p className="text-sm text-primary-foreground/70">{ev.desc}</p>
        </div>
        <button onClick={() => setCurrent((current + 1) % events.length)} className="p-1 rounded-full hover:bg-primary-foreground/10">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {events.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-1.5 bg-primary-foreground/30"}`} />
        ))}
      </div>
    </div>
  );
};

export default EventSlider;
