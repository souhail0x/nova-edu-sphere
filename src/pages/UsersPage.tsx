import React, { useState, useEffect } from "react";
import { UserCog, Search, MoreVertical, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string | number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  specialite?: string; // Pour les enseignants
  type?: string;       // Pour les modérateurs
  bio?: string;        // Pour les modérateurs
  status?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const isModerator = currentUser?.role === "moderator";

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: isModerator ? "student" : "student",
    motDePasse: "",
    telephone: "",
    specialite: "",
    type: "INGENIEURIE", // Valeur par défaut pour modérateur
    bio: "",
  });
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = isModerator ? "moderation/etudiants" : "admin/utilisateurs";
      const response = await api.get(endpoint);
      let data = Array.isArray(response.data) ? response.data : response.data.content || [];

      // Normalisation des données pour éviter les crashs
      const normalizedData = data.map((u: any) => {
        let role = (u.role || u.roleName || "student").replace('ROLE_', '').toLowerCase();
        if (role.includes('prof') || role.includes('teach') || role.includes('enseig')) role = 'teacher';
        else if (role.includes('etud') || role.includes('stud')) role = 'student';
        else if (role.includes('admin')) role = 'admin';
        else if (role.includes('moder')) role = 'moderator';

        return {
          ...u,
          nom: u.nom || "",
          prenom: u.prenom || "",
          role: role,
          email: u.email || u.username || "Pas d'email",
          telephone: u.telephone || "",
          specialite: u.specialite || "",
          type: u.type || ""
        };
      });

      setUsers(normalizedData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({ title: "Erreur", description: "Impossible de charger les utilisateurs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role.toLowerCase(),
        motDePasse: "",
        telephone: user.telephone || "",
        specialite: user.specialite || "",
        type: user.type || "INGENIEURIE",
        bio: user.bio || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        role: "student",
        motDePasse: "",
        telephone: "",
        specialite: "",
        type: "INGENIEURIE",
        bio: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapping du rôle vers l'endpoint pluriel correct selon la documentation
    const roleEndpointMap: Record<string, string> = {
      student: "etudiants",
      teacher: "enseignants",
      moderator: "moderateurs",
      admin: "utilisateurs" // Hypothèse pour l'admin
    };

    const rolePath = roleEndpointMap[formData.role];

    if (!rolePath && formData.role === "admin") {
      toast({
        title: "Information",
        description: "La création d'administrateurs n'est pas supportée via ce formulaire.",
        variant: "default"
      });
      return;
    }

    // Détermination de l'URL de base
    const apiBase = isModerator ? "moderation/etudiants" : `admin/${rolePath}`;

    // Construction du payload selon le rôle
    const payload: any = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
    };

    if (!editingUser || (editingUser && formData.motDePasse)) {
      payload.motDePasse = formData.motDePasse;
    }

    if (formData.role === "teacher") {
      payload.specialite = formData.specialite;
    } else if (formData.role === "moderator") {
      payload.type = formData.type;
      payload.bio = formData.bio;
    } else if (formData.role === "student") {
      payload.bio = formData.bio;
    }

    try {
      if (editingUser) {
        const finalUrl = isModerator ? `moderation/etudiants/${editingUser.id}` : `admin/${rolePath}/${editingUser.id}`;
        await api.put(finalUrl, payload);
        toast({ title: "Succès", description: "Utilisateur mis à jour avec succès" });
      } else {
        const finalUrl = isModerator ? "moderation/etudiants" : `admin/${rolePath}`;
        await api.post(finalUrl, payload);
        toast({ title: "Succès", description: "Utilisateur créé avec succès" });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      const endpoint = isModerator ? `moderation/etudiants/${id}` : `admin/utilisateurs/${id}`;
      await api.delete(endpoint);
      toast({ title: "Succès", description: "Utilisateur supprimé" });
      fetchUsers();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'utilisateur", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(u =>
    (u.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {isModerator ? "Gestion des Étudiants" : "Gestion des Utilisateurs"}
          </h1>
          <p className="text-muted-foreground">
            {users.length} {isModerator ? "étudiants" : "utilisateurs"} enregistrés.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Plus className="h-4 w-4" /> Ajouter {isModerator ? "un étudiant" : "un utilisateur"}
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-2 w-full max-w-sm focus-within:ring-2 focus-within:ring-accent/20 focus-within:bg-background transition-all">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Rechercher un utilisateur..."
              className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="p-4 font-semibold text-muted-foreground">Utilisateur</th>
                <th className="p-4 font-semibold text-muted-foreground">Email</th>
                <th className="p-4 font-semibold text-muted-foreground">Rôle</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {(u.nom?.[0] || u.prenom?.[0] || "U").toUpperCase()}
                        </div>
                        <span className="font-medium">{u.prenom} {u.nom}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="capitalize">
                        {u.role.replace('ROLE_', '').toLowerCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleOpenModal(u)} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(u.id)} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Ajouter un nouvel utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prénom</label>
                <Input
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Ex: Sara"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Ali"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@school.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="0600000000"
              />
            </div>
            {(!editingUser || (editingUser && formData.motDePasse !== "")) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                </label>
                <Input
                  type="password"
                  required={!editingUser}
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                  placeholder="********"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
                disabled={!!editingUser || isModerator} 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  {!isModerator && (
                    <>
                      <SelectItem value="teacher">Enseignant</SelectItem>
                      <SelectItem value="moderator">Modérateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {formData.role === "teacher" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialité</label>
                <Input
                  required
                  value={formData.specialite}
                  onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                  placeholder="Ex: Mathématiques"
                />
              </div>
            )}

            {formData.role === "moderator" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de Modérateur</label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INGENIEURIE">Ingénierie</SelectItem>
                    <SelectItem value="MANAGEMENT">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(formData.role === "moderator" || formData.role === "student") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Biographie</label>
                <Input
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={formData.role === "moderator" ? "Ex: Passionné par l'éducation..." : "Ex: Étudiant en 4ème année..."}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary">
                {editingUser ? "Mettre à jour" : "Créer l'utilisateur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
