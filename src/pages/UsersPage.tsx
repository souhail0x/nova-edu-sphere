import { UserCog, Search, MoreVertical } from "lucide-react";

const users = [
  { id: 1, name: "Ahmed Benali", email: "student@iga.ma", role: "Étudiant", status: "Actif" },
  { id: 2, name: "Fatima Zahra", email: "fatima@iga.ma", role: "Étudiant", status: "Actif" },
  { id: 3, name: "Prof. Bahri", email: "teacher@iga.ma", role: "Enseignant", status: "Actif" },
  { id: 4, name: "Sara Alaoui", email: "moderator@iga.ma", role: "Modérateur", status: "Actif" },
  { id: 5, name: "Omar Khalid", email: "omar@iga.ma", role: "Étudiant", status: "Inactif" },
];

const UsersPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">{users.length} utilisateurs enregistrés.</p>
      </div>
      <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
        <UserCog className="h-4 w-4" /> Ajouter
      </button>
    </div>
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Rechercher un utilisateur..." className="bg-transparent text-sm outline-none w-full" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50 text-left">
            <th className="p-3 font-medium text-muted-foreground">Nom</th>
            <th className="p-3 font-medium text-muted-foreground">Email</th>
            <th className="p-3 font-medium text-muted-foreground">Rôle</th>
            <th className="p-3 font-medium text-muted-foreground">Statut</th>
            <th className="p-3 font-medium text-muted-foreground w-10"></th>
          </tr></thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{u.name.charAt(0)}</div>
                  {u.name}
                </td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{u.role}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "Actif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{u.status}</span></td>
                <td className="p-3"><button className="p-1 hover:bg-secondary rounded"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default UsersPage;
