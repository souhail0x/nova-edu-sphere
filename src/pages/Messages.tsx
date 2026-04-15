import { useState } from "react";
import { Send, Search } from "lucide-react";

const contacts = [
  { id: 1, name: "Prof. Bahri", lastMsg: "Bien reçu, merci.", time: "14:30", unread: 0 },
  { id: 2, name: "Prof. Riyami", lastMsg: "Le devoir est pour vendredi.", time: "12:00", unread: 2 },
  { id: 3, name: "Sara Alaoui", lastMsg: "Rdv pour le projet ?", time: "Hier", unread: 0 },
];

const Messages = () => {
  const [selected, setSelected] = useState(contacts[0]);
  const [msg, setMsg] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Messages</h1>
      <div className="bg-card border rounded-xl overflow-hidden flex h-[calc(100vh-12rem)]">
        {/* Contacts */}
        <div className="w-72 border-r flex-shrink-0 hidden md:flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Rechercher..." className="bg-transparent text-sm outline-none w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left p-3 flex items-center gap-3 hover:bg-secondary transition-colors ${selected.id === c.id ? "bg-secondary" : ""}`}>
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && <span className="h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">{selected.name.charAt(0)}</div>
            <span className="font-medium">{selected.name}</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="flex justify-start"><div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-2 max-w-xs text-sm">Bonjour, comment puis-je vous aider ?</div></div>
            <div className="flex justify-end"><div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-4 py-2 max-w-xs text-sm">J'ai une question sur le dernier cours.</div></div>
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Écrire un message..." className="flex-1 px-4 py-2 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent text-sm" />
            <button className="bg-accent text-accent-foreground p-2.5 rounded-lg hover:opacity-90 transition-opacity">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
