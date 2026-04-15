import { useState } from "react";
import { Inbox, Send, Star, StarOff, ChevronLeft, Mail, MailOpen, Search } from "lucide-react";

type Message = {
  id: number;
  from: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent";
};

const initialMessages: Message[] = [
  { id: 1, from: "Prof. Bahri", to: "Vous", subject: "Résultat du Quiz Mobile", preview: "Bonjour, votre note pour le quiz...", body: "Bonjour Ahmed,\n\nVotre note pour le quiz de développement mobile est de 17/20. Excellent travail ! Continuez ainsi.\n\nCordialement,\nProf. Bahri", date: "15 Avr 2026", read: false, starred: false, folder: "inbox" },
  { id: 2, from: "Prof. Riyami", to: "Vous", subject: "Devoir BDD - Date limite", preview: "Le devoir est à rendre pour vendredi...", body: "Bonjour,\n\nJe vous rappelle que le devoir d'administration des bases de données est à rendre pour vendredi prochain au plus tard.\n\nMerci de respecter le délai.\n\nProf. Riyami", date: "14 Avr 2026", read: false, starred: true, folder: "inbox" },
  { id: 3, from: "Sara Alaoui", to: "Vous", subject: "Réunion projet tuteuré", preview: "Salut, on se retrouve quand pour...", body: "Salut Ahmed,\n\nOn se retrouve quand pour avancer sur le projet tuteuré ? Je propose mercredi à 14h à la bibliothèque.\n\nDis-moi si ça te convient.\n\nSara", date: "13 Avr 2026", read: true, starred: false, folder: "inbox" },
  { id: 4, from: "Administration IGA", to: "Vous", subject: "Planning des examens finaux", preview: "Veuillez trouver ci-joint le planning...", body: "Chers étudiants,\n\nVeuillez trouver ci-joint le planning des examens finaux du 2ème semestre. Les examens débuteront le 15 mai.\n\nCordialement,\nAdministration IGA", date: "12 Avr 2026", read: true, starred: false, folder: "inbox" },
  { id: 5, from: "Vous", to: "Prof. Bahri", subject: "Question sur le chapitre 5", preview: "Professeur, j'ai une question concernant...", body: "Professeur,\n\nJ'ai une question concernant le chapitre 5 sur les fragments Android. Pourriez-vous m'expliquer la différence entre les fragments statiques et dynamiques ?\n\nMerci d'avance.\n\nAhmed Benali", date: "11 Avr 2026", read: true, starred: false, folder: "sent" },
  { id: 6, from: "Vous", to: "Sara Alaoui", subject: "Re: Projet tuteuré", preview: "Oui ça me va, à mercredi...", body: "Salut Sara,\n\nOui ça me va, à mercredi 14h à la bibliothèque.\n\nÀ bientôt,\nAhmed", date: "10 Avr 2026", read: true, starred: false, folder: "sent" },
];

const folders = [
  { key: "inbox" as const, label: "Boîte de réception", icon: Inbox },
  { key: "sent" as const, label: "Envoyés", icon: Send },
  { key: "starred" as const, label: "Favoris", icon: Star },
];

const Messages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "starred">("inbox");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter((m) => {
    const matchesFolder =
      activeFolder === "starred" ? m.starred :
      m.folder === activeFolder;
    const matchesSearch = searchQuery === "" ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.folder === "inbox" && !m.read).length;

  const handleOpen = (msg: Message) => {
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    setSelectedMsg({ ...msg, read: true });
  };

  const toggleStar = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, starred: !m.starred } : m));
    if (selectedMsg?.id === id) setSelectedMsg((prev) => prev ? { ...prev, starred: !prev.starred } : null);
  };

  if (selectedMsg) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedMsg(null)} className="flex items-center gap-1 text-sm text-accent hover:underline">
          <ChevronLeft className="h-4 w-4" /> Retour
        </button>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading text-xl font-bold">{selectedMsg.subject}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                De: <span className="font-medium text-foreground">{selectedMsg.from}</span> · À: <span className="font-medium text-foreground">{selectedMsg.to}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedMsg.date}</p>
            </div>
            <button onClick={() => toggleStar(selectedMsg.id)} className="text-accent hover:opacity-80">
              {selectedMsg.starred ? <Star className="h-5 w-5 fill-accent" /> : <StarOff className="h-5 w-5" />}
            </button>
          </div>
          <div className="border-t pt-4 whitespace-pre-line text-sm leading-relaxed">{selectedMsg.body}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Messages</h1>
      <div className="bg-card border rounded-xl overflow-hidden flex h-[calc(100vh-12rem)]">
        {/* Folder sidebar */}
        <div className="w-56 border-r flex-shrink-0 hidden md:flex flex-col bg-secondary/30">
          <div className="p-3 space-y-0.5">
            {folders.map((f) => {
              const isActive = activeFolder === f.key;
              return (
                <button key={f.key} onClick={() => setActiveFolder(f.key)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  <f.icon className="h-4 w-4" />
                  {f.label}
                  {f.key === "inbox" && unreadCount > 0 && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher des messages..." className="bg-transparent text-sm outline-none w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Mail className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-sm">Aucun message</p>
              </div>
            ) : (
              filteredMessages.map((m) => (
                <button key={m.id} onClick={() => handleOpen(m)} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${!m.read ? "bg-primary/5" : ""}`}>
                  <button onClick={(e) => toggleStar(m.id, e)} className="text-muted-foreground hover:text-accent flex-shrink-0">
                    {m.starred ? <Star className="h-4 w-4 fill-accent text-accent" /> : <Star className="h-4 w-4" />}
                  </button>
                  {m.read ? <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <Mail className="h-4 w-4 text-primary flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${!m.read ? "font-semibold" : "font-medium"}`}>{activeFolder === "sent" ? m.to : m.from}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{m.date}</span>
                    </div>
                    <p className={`text-sm truncate ${!m.read ? "font-semibold" : ""}`}>{m.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
