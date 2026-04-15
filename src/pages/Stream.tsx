import { Video, Mic, MicOff, VideoOff, Monitor, MessageSquare, Phone, Send, Play } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const streamInfo = {
  title: "Développement Mobile - Chapitre 5",
  teacher: "Prof. Bahri",
  time: "14:00 - 15:15",
  description: "Cours sur les fragments Android et la navigation multi-écrans.",
};

const Stream = () => {
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  if (!joined) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-bold">Classe en Direct</h1>
        <div className="flex items-center justify-center h-[calc(100vh-14rem)]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl p-8 max-w-md w-full text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Video className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">{streamInfo.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{streamInfo.teacher}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{streamInfo.time}</p>
            </div>
            <p className="text-sm text-muted-foreground">{streamInfo.description}</p>
            <button onClick={() => setJoined(true)} className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Play className="h-4 w-4" /> Rejoindre la session
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Classe en Direct</h1>
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-foreground rounded-xl flex items-center justify-center relative">
            <div className="text-center text-background">
              <Video className="h-16 w-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-heading font-semibold">{streamInfo.teacher}</p>
              <p className="text-sm opacity-50">{streamInfo.title}</p>
            </div>
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">Vous</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-full ${micOn ? "bg-secondary" : "bg-destructive text-destructive-foreground"}`}>
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button onClick={() => setCamOn(!camOn)} className={`p-3 rounded-full ${camOn ? "bg-secondary" : "bg-destructive text-destructive-foreground"}`}>
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button className="p-3 rounded-full bg-secondary"><Monitor className="h-5 w-5" /></button>
            <button onClick={() => setChatOpen(!chatOpen)} className="p-3 rounded-full bg-secondary"><MessageSquare className="h-5 w-5" /></button>
            <button onClick={() => setJoined(false)} className="p-3 rounded-full bg-destructive text-destructive-foreground"><Phone className="h-5 w-5" /></button>
          </div>
        </div>
        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-72 bg-card border rounded-xl flex flex-col hidden lg:flex">
              <div className="p-3 border-b font-heading font-semibold text-sm">Chat en direct</div>
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
                <div><span className="font-medium text-accent">Omar:</span> <span className="text-muted-foreground">Bonjour tout le monde</span></div>
                <div><span className="font-medium text-accent">Fatima:</span> <span className="text-muted-foreground">Le son est bon</span></div>
              </div>
              <div className="p-3 border-t flex gap-2">
                <input placeholder="Message..." className="flex-1 px-3 py-1.5 rounded-lg border bg-background text-foreground outline-none text-sm" />
                <button className="bg-accent text-accent-foreground p-1.5 rounded-lg"><Send className="h-3 w-3" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Stream;
