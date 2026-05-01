import React, { useState, useEffect } from "react";
import { Layers, Search, MoreVertical, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import niveauService, { Niveau } from "@/lib/services/niveauService";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NiveauxPage = () => {
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNiveau, setEditingNiveau] = useState<Niveau | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Niveau>({
    nom: "",
    filiere: "",
    annee: "",
  });

  const fetchNiveaux = async () => {
    setLoading(true);
    try {
      const data = await niveauService.getAll();
      setNiveaux(data);
    } catch (error) {
      console.error("Failed to fetch niveaux:", error);
      toast({ title: "Erreur", description: "Impossible de charger les niveaux", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiveaux();
  }, []);

  const handleOpenModal = (niveau: Niveau | null = null) => {
    if (niveau) {
      setEditingNiveau(niveau);
      setFormData({
        nom: niveau.nom,
        filiere: niveau.filiere,
        annee: niveau.annee,
      });
    } else {
      setEditingNiveau(null);
      setFormData({
        nom: "",
        filiere: "",
        annee: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNiveau?.id) {
        await niveauService.update(editingNiveau.id, formData);
        toast({ title: "Succès", description: "Niveau mis à jour avec succès" });
      } else {
        await niveauService.create(formData);
        toast({ title: "Succès", description: "Niveau créé avec succès" });
      }
      setIsModalOpen(false);
      fetchNiveaux();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) return;
    try {
      await niveauService.delete(id);
      toast({ title: "Succès", description: "Niveau supprimé" });
      fetchNiveaux();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer le niveau", variant: "destructive" });
    }
  };

  const filteredNiveaux = niveaux.filter(n =>
    (n.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.filiere || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gestion des Niveaux</h1>
          <p className="text-muted-foreground">{niveaux.length} niveaux enregistrés.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Plus className="h-4 w-4" /> Ajouter un niveau
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-2 w-full max-w-sm focus-within:ring-2 focus-within:ring-accent/20 focus-within:bg-background transition-all">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Rechercher un niveau..."
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
                <th className="p-4 font-semibold text-muted-foreground">Nom</th>
                <th className="p-4 font-semibold text-muted-foreground">Filière</th>
                <th className="p-4 font-semibold text-muted-foreground">Année</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Chargement des niveaux...
                  </td>
                </tr>
              ) : filteredNiveaux.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Aucun niveau trouvé.
                  </td>
                </tr>
              ) : (
                filteredNiveaux.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-4 font-medium text-foreground">{n.nom}</td>
                    <td className="p-4 text-muted-foreground">{n.filiere}</td>
                    <td className="p-4 text-muted-foreground">{n.annee}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleOpenModal(n)} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => n.id && handleDelete(n.id)} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
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
              {editingNiveau ? "Modifier le niveau" : "Ajouter un nouveau niveau"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du niveau</label>
              <Input
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Licence 3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filière</label>
              <Input
                required
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                placeholder="Ex: Informatique"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Année</label>
              <Input
                required
                value={formData.annee}
                onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                placeholder="Ex: 2024-2025"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary">
                {editingNiveau ? "Mettre à jour" : "Créer le niveau"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NiveauxPage;
