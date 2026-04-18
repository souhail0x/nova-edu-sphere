import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, PencilLine, Upload, FileText, Trash2, X, Pencil, Check } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import CoursePreview from "./CoursePreview";
import { toast } from "@/hooks/use-toast";

type Step = "choice" | "import" | "form" | "editor" | "preview" | "supports";

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructorName?: string;
  onCreated?: (course: { title: string; chapter: string; content: string; supports: string[] }) => void;
}

const AddCourseDialog: React.FC<AddCourseDialogProps> = ({ open, onOpenChange, instructorName, onCreated }) => {
  const [step, setStep] = useState<Step>("choice");
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [content, setContent] = useState("");
  const [supports, setSupports] = useState<File[]>([]);
  const [importedPdf, setImportedPdf] = useState<File | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const supportInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("choice");
    setTitle("");
    setChapter("");
    setContent("");
    setSupports([]);
    setImportedPdf(null);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const finalize = (withSupports: boolean) => {
    onCreated?.({
      title,
      chapter,
      content,
      supports: withSupports ? supports.map((f) => f.name) : [],
    });
    toast({ title: "Cours créé", description: `"${title}" a été ajouté avec succès.` });
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* STEP 1 — CHOICE */}
        {step === "choice" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Ajouter un cours</DialogTitle>
              <DialogDescription>Choisissez la méthode d'ajout de votre cours.</DialogDescription>
            </DialogHeader>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => setStep("import")}
                className="group border rounded-xl p-6 text-left hover:border-primary hover:bg-primary/5 transition"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <FileUp className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Importer un cours PDF</h3>
                <p className="text-xs text-muted-foreground">
                  Téléchargez un fichier PDF qui sera traité par notre IA.
                </p>
              </button>
              <button
                onClick={() => setStep("form")}
                className="group border rounded-xl p-6 text-left hover:border-primary hover:bg-primary/5 transition"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition">
                  <PencilLine className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Créer mon cours</h3>
                <p className="text-xs text-muted-foreground">
                  Composez votre cours étape par étape avec notre éditeur.
                </p>
              </button>
            </div>
          </>
        )}

        {/* STEP 1b — IMPORT PDF */}
        {step === "import" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Importer un cours PDF</DialogTitle>
              <DialogDescription>
                Le fichier sera traité par notre modèle d'IA (fonctionnalité à venir).
              </DialogDescription>
            </DialogHeader>
            <div
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition"
            >
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">
                {importedPdf ? importedPdf.name : "Cliquez pour sélectionner un PDF"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF uniquement, max 50 Mo</p>
            </div>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setImportedPdf(e.target.files?.[0] ?? null)}
            />
            <div className="flex justify-between gap-2 mt-2">
              <Button variant="ghost" onClick={() => setStep("choice")}>Retour</Button>
              <Button
                disabled={!importedPdf}
                onClick={() => {
                  toast({
                    title: "PDF importé",
                    description: "Le fichier sera traité ultérieurement par l'IA.",
                  });
                  handleClose(false);
                }}
              >
                Confirmer l'import
              </Button>
            </div>
          </>
        )}

        {/* STEP 2 — FORM */}
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Créer un cours</DialogTitle>
              <DialogDescription>Renseignez les informations principales.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">
                  Titre du cours <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="course-title"
                  placeholder="Ex : Développement web avancé"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter-title">Titre du chapitre</Label>
                <Input
                  id="chapter-title"
                  placeholder="Ex : Introduction à React"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-2">
              <Button variant="ghost" onClick={() => setStep("choice")}>Retour</Button>
              <Button disabled={!title.trim()} onClick={() => setStep("editor")}>
                Suivant
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 — EDITOR */}
        {step === "editor" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">
                {chapter || "Contenu du chapitre"}
              </DialogTitle>
              <DialogDescription>
                Rédigez le contenu de votre chapitre. Vous pouvez ajouter du texte et des images.
              </DialogDescription>
            </DialogHeader>
            <RichTextEditor value={content} onChange={setContent} />
            <div className="flex justify-between gap-2 mt-2">
              <Button variant="ghost" onClick={() => setStep("form")}>Retour</Button>
              <Button onClick={() => setStep("preview")} disabled={!content.trim()}>
                Terminer le chapitre
              </Button>
            </div>
          </>
        )}

        {/* STEP 4 — PREVIEW */}
        {step === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Prévisualisation du cours</DialogTitle>
              <DialogDescription>
                Voici le rendu tel qu'il sera affiché aux étudiants.
              </DialogDescription>
            </DialogHeader>
            <CoursePreview
              title={title}
              chapter={chapter}
              content={content}
              instructor={instructorName}
            />
            <div className="flex justify-between gap-2 mt-2">
              <Button variant="outline" onClick={() => setStep("editor")}>
                <Pencil className="h-4 w-4" /> Modifier
              </Button>
              <Button onClick={() => setStep("supports")}>
                <Check className="h-4 w-4" /> Confirmer et continuer
              </Button>
            </div>
          </>
        )}

        {/* STEP 5 — SUPPORTS */}
        {step === "supports" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Ajouter des supports</DialogTitle>
              <DialogDescription>
                Veuillez ajouter des supports (PDF) pour votre chapitre.
              </DialogDescription>
            </DialogHeader>
            <div
              onClick={() => supportInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Cliquez pour ajouter des PDF</p>
              <p className="text-xs text-muted-foreground mt-1">Plusieurs fichiers acceptés</p>
            </div>
            <input
              ref={supportInputRef}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                setSupports((prev) => [...prev, ...files]);
                e.target.value = "";
              }}
            />
            {supports.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {supports.map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm truncate">{f.name}</span>
                    </div>
                    <button
                      onClick={() => setSupports((prev) => prev.filter((_, j) => j !== i))}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between gap-2 mt-2">
              <Button variant="ghost" onClick={() => finalize(false)}>
                <X className="h-4 w-4" /> Non, ignorer
              </Button>
              <Button onClick={() => finalize(true)} disabled={supports.length === 0}>
                Valider avec supports
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
