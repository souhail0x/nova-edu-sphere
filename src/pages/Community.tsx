import { useState } from "react";
import { Users, MessageSquare, ThumbsUp, Send } from "lucide-react";

const communities = [
  { id: 1, name: "4DLTI MRS - Général", members: 45, posts: 120, desc: "Discussion générale de la classe 4DLTI" },
  { id: 2, name: "Club Développement", members: 80, posts: 250, desc: "Partage de projets et d'articles tech" },
  { id: 3, name: "Préparation Examens", members: 60, posts: 95, desc: "Entraide pour la révision des examens" },
];

const posts = [
  { id: 1, author: "Yassine M.", content: "Quelqu'un a les notes du cours de JEE de la semaine dernière ?", likes: 5, replies: 3, time: "il y a 2h" },
  { id: 2, author: "Fatima Z.", content: "Je partage mes notes de gestion de projet : lien dans les commentaires.", likes: 12, replies: 8, time: "il y a 5h" },
  { id: 3, author: "Omar K.", content: "Le hackathon approche ! Qui cherche une équipe ?", likes: 20, replies: 15, time: "il y a 1j" },
];

const Community = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [newPost, setNewPost] = useState("");

  if (selected !== null) {
    const comm = communities.find((c) => c.id === selected)!;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="text-sm text-accent hover:underline">← Retour aux communautés</button>
        <div>
          <h1 className="font-heading text-2xl font-bold">{comm.name}</h1>
          <p className="text-muted-foreground">{comm.desc}</p>
        </div>
        <div className="flex gap-3">
          <input value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Écrire un message..." className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent" />
          <button className="bg-accent text-accent-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-card border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">{p.author.charAt(0)}</div>
                  <span className="font-medium text-sm">{p.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{p.time}</span>
              </div>
              <p className="text-sm mb-3">{p.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-accent transition-colors"><ThumbsUp className="h-3 w-3" />{p.likes}</button>
                <button className="flex items-center gap-1 hover:text-accent transition-colors"><MessageSquare className="h-3 w-3" />{p.replies}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Communautés</h1>
        <p className="text-muted-foreground">Rejoignez des groupes de discussion.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((c) => (
          <button key={c.id} onClick={() => setSelected(c.id)} className="bg-card border rounded-xl p-5 text-left card-hover">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold mb-1">{c.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{c.desc}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{c.members} membres</span>
              <span>{c.posts} posts</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Community;
