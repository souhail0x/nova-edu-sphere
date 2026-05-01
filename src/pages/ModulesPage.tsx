import React, { useState, useEffect } from "react";
import { BookOpen, Search, MoreVertical, Trash2, Edit, Plus, Loader2, Filter } from "lucide-react";
import moduleService, { ModuleResponse, ModuleRequest } from "@/lib/services/moduleService";
import niveauService, { Niveau } from "@/lib/services/niveauService";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Teacher {
  id: number;
  nom: string;
  prenom: string;
}

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleResponse[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveauFilter, setSelectedNiveauFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleResponse | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const isModerator = currentUser?.role === "moderator";

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    duree: "",
    niveauId: "",
    enseignantId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modulesData, niveauxData] = await Promise.all([
        moduleService.getAll(),
        niveauService.getAll(),
      ]);
      setModules(modulesData);
      setNiveaux(niveauxData);

      // Fetch teachers
      try {
        const teachersRes = await api.get("admin/utilisateurs");
        const allUsers = Array.isArray(teachersRes.data) ? teachersRes.data : teachersRes.data.content || [];
        
        // Filter teachers and normalize
        const teacherList = allUsers.filter((u: any) => {
          const role = (u.role || u.roleName || "").replace('ROLE_', '').toLowerCase();
          return role.includes('prof') || role.includes('teach') || role.includes('enseig');
        }).map((u: any) => ({
          id: u.id,
          nom: u.nom || "",
          prenom: u.prenom || ""
        }));
        
        setTeachers(teacherList);
      } catch (err) {
        console.error("Failed to fetch teachers from utilisateurs, trying enseignants...", err);
        const teachersRes = await api.get("admin/enseignants");
        const data = Array.isArray(teachersRes.data) ? teachersRes.data : teachersRes.data.content || [];
        setTeachers(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchModulesByNiveau = async (niveauId: string) => {
    if (niveauId === "all") {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const data = await moduleService.getByNiveau(Number(niveauId));
      setModules(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de filtrer par niveau", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (mod: ModuleResponse | null = null) => {
    if (mod) {
      setEditingModule(mod);
      setFormData({
        titre: mod.titre || "",
        description: mod.description || "",
        duree: mod.duree || "",
        niveauId: (mod.niveauId || mod.niveau?.id)?.toString() || "",
        enseignantId: (mod.enseignantId || mod.enseignant?.id)?.toString() || "",
      });
    } else {
      setEditingModule(null);
      setFormData({
        titre: "",
        description: "",
        duree: "",
        niveauId: "",
        enseignantId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ModuleRequest = {
      titre: formData.titre,
      description: formData.description,
      duree: formData.duree,
      niveauId: Number(formData.niveauId),
      enseignantId: Number(formData.enseignantId),
    };

    try {
      console.log("🚀 Submitting Module Payload:", payload);
      if (editingModule) {
        await moduleService.update(editingModule.id, payload);
        toast({ title: "Succès", description: "Module mis à jour" });
      } else {
        const response = await moduleService.create(payload);
        console.log("✅ Module Created Response:", response);
        toast({ title: "Succès", description: "Module créé" });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce module ?")) return;
    try {
      await moduleService.delete(id);
      toast({ title: "Succès", description: "Module supprimé" });
      fetchData();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const filteredModules = modules.filter(m =>
    (m.titre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.enseignantNom || m.enseignant?.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gestion des Modules</h1>
          <p className="text-muted-foreground">{modules.length} modules au total.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Plus className="h-4 w-4" /> Ajouter un module
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 border rounded-xl shadow-sm">
        <div className="flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher un module..."
            className="bg-transparent text-sm outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrer par niveau:</span>
          </div>
          <Select value={selectedNiveauFilter} onValueChange={(v) => {
            setSelectedNiveauFilter(v);
            fetchModulesByNiveau(v);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les niveaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {niveaux.map(n => (
                <SelectItem key={n.id} value={n.id?.toString() || ""}>{n.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Niveau</th>
                <th className="p-4 font-semibold">Enseignant</th>
                <th className="p-4 font-semibold">Durée</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun module trouvé.</td></tr>
              ) : (
                filteredModules.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{m.titre}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{m.description}</div>
                    </td>
                    <td className="p-4">{m.niveauNom || m.niveau?.nom || "Non assigné"}</td>
                    <td className="p-4">
                      {m.enseignantPrenom || m.enseignant?.prenom || ""} {m.enseignantNom || m.enseignant?.nom || "Non assigné"}
                    </td>
                    <td className="p-4">{m.duree}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenModal(m)} className="gap-2"><Edit className="h-4 w-4" /> Modifier</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(m.id)} className="gap-2 text-destructive"><Trash2 className="h-4 w-4" /> Supprimer</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editingModule ? "Modifier le module" : "Nouveau module"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input required value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} placeholder="Ex: Programmation Java" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Détails du module..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Durée</label>
                <Input required value={formData.duree} onChange={(e) => setFormData({ ...formData, duree: e.target.value })} placeholder="Ex: 30h" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <Select required value={formData.niveauId} onValueChange={(v) => setFormData({ ...formData, niveauId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir un niveau" /></SelectTrigger>
                  <SelectContent>
                    {niveaux.map(n => <SelectItem key={n.id} value={n.id?.toString() || ""}>{n.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Enseignant</label>
              <Select required value={formData.enseignantId} onValueChange={(v) => setFormData({ ...formData, enseignantId: v })}>
                <SelectTrigger><SelectValue placeholder="Assigner un enseignant" /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.prenom} {t.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-primary">{editingModule ? "Mettre à jour" : "Créer le module"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModulesPage;
