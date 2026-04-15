import { Video, Mic, MicOff, VideoOff, Monitor, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";

const Stream = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Classe en Direct</h1>
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-foreground rounded-xl flex items-center justify-center relative">
            <div className="text-center text-background">
              <Video className="h-16 w-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-heading font-semibold">Prof. Bahri</p>
              <p className="text-sm opacity-50">Développement Mobile - Chapitre 5</p>
            </div>
            {/* Small self view */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">Vous</span>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-full ${micOn ? "bg-secondary" : "bg-destructive text-destructive-foreground"}`}>
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button onClick={() => setCamOn(!camOn)} className={`p-3 rounded-full ${camOn ? "bg-secondary" : "bg-destructive text-destructive-foreground"}`}>
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button className="p-3 rounded-full bg-secondary"><Monitor className="h-5 w-5" /></button>
            <button onClick={() => setChatOpen(!chatOpen)} className="p-3 rounded-full bg-secondary"><MessageSquare className="h-5 w-5" /></button>
            <button className="p-3 rounded-full bg-destructive text-destructive-foreground"><Phone className="h-5 w-5" /></button>
          </div>
        </div>
        {/* Chat sidebar */}
        {chatOpen && (
          <div className="w-72 bg-card border rounded-xl flex flex-col hidden lg:flex">
            <div className="p-3 border-b font-heading font-semibold text-sm">Chat en direct</div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              <div><span className="font-medium text-accent">Omar:</span> <span className="text-muted-foreground">Bonjour tout le monde</span></div>
              <div><span className="font-medium text-accent">Fatima:</span> <span className="text-muted-foreground">Le son est bon</span></div>
            </div>
            <div className="p-3 border-t flex gap-2">
              <input placeholder="Message..." className="flex-1 px-3 py-1.5 rounded-lg border bg-background text-foreground outline-none text-sm" />
              <button className="bg-accent text-accent-foreground p-1.5 rounded-lg"><Send className="h-3 w-3" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stream;
