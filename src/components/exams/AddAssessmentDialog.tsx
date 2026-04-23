import React, { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers3,
  Sparkles,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AssessmentType = "quiz" | "exam";
type CreationMode = "ai" | "manual";
type Step = "type" | "config" | "chapter" | "count" | "mode" | "manual" | "review" | "publish";
type AnswerKey = "A" | "B" | "C" | "D";

interface QuestionDraft {
  text: string;
  options: Record<AnswerKey, string>;
  correctAnswer: AnswerKey;
}

interface AssessmentDraft {
  title: string;
  type: AssessmentType;
  duration: string;
  courseLabel: string;
  chapterLabel?: string;
  questionCount: number;
  creationMode: CreationMode;
}

interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublished?: (assessment: AssessmentDraft) => void;
}

const MOCK_COURSES = [
  {
    id: "java-programming",
    label: "Java Programming",
    chapters: ["Chapter 1: Introduction", "Chapter 2: OOP", "Chapter 3: Collections"],
  },
  {
    id: "data-structures",
    label: "Data Structures",
    chapters: ["Chapter 1: Arrays", "Chapter 2: Linked Lists", "Chapter 3: Trees"],
  },
  {
    id: "web-development",
    label: "Web Development",
    chapters: ["Chapter 1: HTML & CSS", "Chapter 2: JavaScript", "Chapter 3: React Basics"],
  },
  {
    id: "database-systems",
    label: "Database Systems",
    chapters: ["Chapter 1: SQL Basics", "Chapter 2: Joins", "Chapter 3: Transactions"],
  },
];

const DURATION_OPTIONS = ["30 min", "60 min", "90 min", "120 min"];
const STEP_LABELS: Record<Step, string> = {
  type: "Type",
  config: "Configuration",
  chapter: "Chapitre",
  count: "Questions",
  mode: "Mode",
  manual: "Rédaction",
  review: "Relecture",
  publish: "Publication",
};

const createEmptyQuestion = (): QuestionDraft => ({
  text: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
});

const createAiQuestions = (count: number, courseLabel: string, chapterLabel?: string): QuestionDraft[] =>
  Array.from({ length: count }, (_, index) => ({
    text: `Question ${index + 1} — ${chapterLabel || courseLabel}`,
    options: {
      A: `Concept clé ${index + 1}`,
      B: `Alternative ${index + 1}`,
      C: `Piège fréquent ${index + 1}`,
      D: `Bonne pratique ${index + 1}`,
    },
    correctAnswer: (["A", "B", "C", "D"] as AnswerKey[])[index % 4],
  }));

const AddAssessmentDialog: React.FC<AddAssessmentDialogProps> = ({ open, onOpenChange, onPublished }) => {
  const [step, setStep] = useState<Step>("type");
  const [assessmentType, setAssessmentType] = useState<AssessmentType | null>(null);
  const [duration, setDuration] = useState("60 min");
  const [courseId, setCourseId] = useState("");
  const [chapterLabel, setChapterLabel] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [creationMode, setCreationMode] = useState<CreationMode | null>(null);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const selectedCourse = useMemo(
    () => MOCK_COURSES.find((course) => course.id === courseId) ?? null,
    [courseId],
  );

  useEffect(() => {
    if (!open) {
      setStep("type");
      setAssessmentType(null);
      setDuration("60 min");
      setCourseId("");
      setChapterLabel("");
      setQuestionCount(20);
      setCreationMode(null);
      setQuestions([]);
      setActiveQuestionIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!assessmentType) return;
    setQuestionCount(assessmentType === "quiz" ? 10 : 20);
  }, [assessmentType]);

  useEffect(() => {
    if (!carouselApi) return;
    const syncIndex = () => setActiveQuestionIndex(carouselApi.selectedScrollSnap());
    syncIndex();
    carouselApi.on("select", syncIndex);
    return () => {
      carouselApi.off("select", syncIndex);
    };
  }, [carouselApi]);

  const titleLabel = assessmentType === "exam" ? "Examen" : "Quiz";
  const maxQuestions = assessmentType === "quiz" ? 20 : 40;
  const minQuestions = assessmentType === "quiz" ? 10 : 20;

  const canContinueConfig = Boolean(assessmentType && duration && courseId);
  const canContinueChapter = assessmentType === "exam" || Boolean(chapterLabel);
  const canContinueMode = Boolean(creationMode);
  const manualQuestionsValid =
    questions.length === questionCount &&
    questions.every(
      (question) =>
        question.text.trim() && Object.values(question.options).every((option) => option.trim()) && question.correctAnswer,
    );

  const goNextFromConfig = () => {
    if (assessmentType === "quiz") {
      setStep("chapter");
      return;
    }
    setChapterLabel("");
    setStep("count");
  };

  const handleQuestionCountChange = (value: string) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return;
    const clamped = Math.min(maxQuestions, Math.max(minQuestions, numericValue));
    setQuestionCount(clamped);
  };

  const updateQuestion = (index: number, updater: (question: QuestionDraft) => QuestionDraft) => {
    setQuestions((current) => current.map((question, currentIndex) => (currentIndex === index ? updater(question) : question)));
  };

  const handleModeContinue = () => {
    if (!creationMode || !selectedCourse || !assessmentType) return;

    if (creationMode === "ai") {
      setQuestions(createAiQuestions(questionCount, selectedCourse.label, chapterLabel || undefined));
      setStep("review");
      return;
    }

    setQuestions(Array.from({ length: questionCount }, () => createEmptyQuestion()));
    setActiveQuestionIndex(0);
    setStep("manual");
  };

  const handlePublish = () => {
    if (!selectedCourse || !assessmentType || !creationMode) return;

    onPublished?.({
      title: `${titleLabel} - ${selectedCourse.label}`,
      type: assessmentType,
      duration,
      courseLabel: selectedCourse.label,
      chapterLabel: chapterLabel || undefined,
      questionCount,
      creationMode,
    });

    toast({
      title: `${titleLabel} publié`,
      description: `${questionCount} questions prêtes pour ${selectedCourse.label}.`,
    });
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case "type":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "quiz" as const,
                title: "Quiz",
                description: "Évaluation rapide par chapitre ou module.",
                icon: Layers3,
              },
              {
                value: "exam" as const,
                title: "Examen",
                description: "Évaluation complète orientée certification.",
                icon: ClipboardList,
              },
            ].map((option) => {
              const Icon = option.icon;
              const selected = assessmentType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAssessmentType(option.value)}
                  className="rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary hover:bg-accent/40"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    {selected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="font-heading text-base font-semibold">{option.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        );

      case "config":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Temps de passage</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Choisir la durée" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Cours lié</Label>
              <Select
                value={courseId}
                onValueChange={(value) => {
                  setCourseId(value);
                  setChapterLabel("");
                }}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Sélectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COURSES.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "chapter":
        return (
          <div className="grid gap-3">
            <Label>Chapitre / module</Label>
            <div className="grid gap-2">
              {selectedCourse?.chapters.map((chapter) => (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => setChapterLabel(chapter)}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-all hover:border-primary hover:bg-accent/40"
                >
                  <span className="text-sm font-medium">{chapter}</span>
                  {chapterLabel === chapter && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        );

      case "count":
        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              {assessmentType === "quiz"
                ? "Le quiz accepte entre 10 et 20 questions."
                : "20 questions est la recommandation par défaut pour un examen, mais vous pouvez ajuster si besoin."}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question-count">Nombre de questions</Label>
              <Input
                id="question-count"
                type="number"
                min={minQuestions}
                max={maxQuestions}
                value={questionCount}
                onChange={(event) => handleQuestionCountChange(event.target.value)}
              />
            </div>
          </div>
        );

      case "mode":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "ai" as const,
                title: "AI Generated Questions",
                description: "Préremplir automatiquement les questions selon le cours et le volume demandé.",
                icon: Bot,
              },
              {
                value: "manual" as const,
                title: "Manual Creation",
                description: "Rédiger chaque question, ses options et la bonne réponse manuellement.",
                icon: FileText,
              },
            ].map((option) => {
              const Icon = option.icon;
              const selected = creationMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCreationMode(option.value)}
                  className="rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary hover:bg-accent/40"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    {selected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="font-heading text-base font-semibold">{option.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        );

      case "manual":
        return (
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  size="sm"
                  variant={activeQuestionIndex === index ? "default" : "outline"}
                  onClick={() => carouselApi?.scrollTo(index)}
                >
                  Q{index + 1}
                </Button>
              ))}
            </div>

            <Carousel setApi={setCarouselApi} opts={{ loop: false, align: "start" }} className="w-full">
              <CarouselContent className="ml-0">
                {questions.map((question, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`question-${index}`}>Question text</Label>
                        <Textarea
                          id={`question-${index}`}
                          placeholder={`Rédiger la question ${index + 1}`}
                          value={question.text}
                          onChange={(event) =>
                            updateQuestion(index, (current) => ({ ...current, text: event.target.value }))
                          }
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => (
                          <div key={key} className="grid gap-2">
                            <Label htmlFor={`question-${index}-${key}`}>Option {key}</Label>
                            <Input
                              id={`question-${index}-${key}`}
                              value={question.options[key]}
                              onChange={(event) =>
                                updateQuestion(index, (current) => ({
                                  ...current,
                                  options: { ...current.options, [key]: event.target.value },
                                }))
                              }
                              placeholder={`Réponse ${key}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-2">
                        <Label>Bonne réponse</Label>
                        <RadioGroup
                          value={question.correctAnswer}
                          onValueChange={(value) =>
                            updateQuestion(index, (current) => ({ ...current, correctAnswer: value as AnswerKey }))
                          }
                          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                        >
                          {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => (
                            <label
                              key={key}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-3 py-3 text-sm"
                            >
                              <RadioGroupItem value={key} id={`correct-${index}-${key}`} />
                              <span>Option {key}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={activeQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Question {activeQuestionIndex + 1} / {questionCount}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => carouselApi?.scrollNext()}
                disabled={activeQuestionIndex === questionCount - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                {creationMode === "ai" ? "Questions générées automatiquement" : "Questions prêtes à relire"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Naviguez entre les questions et revenez à l’édition si nécessaire avant publication.
              </p>
            </div>

            <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-1">
              {questions.map((question, index) => (
                <div key={index} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold">Question {index + 1}</h3>
                    {creationMode === "manual" && (
                      <Button type="button" size="sm" variant="outline" onClick={() => {
                        setStep("manual");
                        setTimeout(() => carouselApi?.scrollTo(index), 0);
                      }}>
                        Modifier
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{question.text || "Question non renseignée"}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(["A", "B", "C", "D"] as AnswerKey[]).map((key) => (
                      <div key={key} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                        <span className="font-medium">{key}.</span> {question.options[key] || "—"}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Bonne réponse : {question.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "publish":
        return (
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-lg border border-border bg-card p-5">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{titleLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cours</p>
                <p className="font-medium">{selectedCourse?.label}</p>
              </div>
              {assessmentType === "quiz" && (
                <div>
                  <p className="text-sm text-muted-foreground">Chapitre</p>
                  <p className="font-medium">{chapterLabel}</p>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-medium">{duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{questionCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <p className="font-medium">{creationMode === "ai" ? "AI Generated" : "Manual"}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 sm:max-h-[92vh]">
        <div className="grid max-h-[92vh] gap-0 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="border-b border-border bg-muted/40 p-5 sm:border-b-0 sm:border-r">
            <DialogHeader className="text-left">
              <DialogTitle className="font-heading text-xl">Ajouter Quiz / Examen</DialogTitle>
              <DialogDescription>
                Flow frontend mock prêt à être branché plus tard à une API.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-2">
              {(
                assessmentType === "exam"
                  ? ["type", "config", "count", "mode", creationMode === "manual" ? "manual" : null, "review", "publish"]
                  : ["type", "config", "chapter", "count", "mode", creationMode === "manual" ? "manual" : null, "review", "publish"]
              )
                .filter(Boolean)
                .map((stepKey) => {
                  const stepName = stepKey as Step;
                  const active = step === stepName;
                  return (
                    <div
                      key={stepName}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-medium">
                        {STEP_LABELS[stepName].slice(0, 1)}
                      </div>
                      <span className="font-medium">{STEP_LABELS[stepName]}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex min-h-[560px] flex-col">
            <div key={step} className="flex-1 overflow-y-auto p-5 sm:p-6 animate-in fade-in-0 slide-in-from-right-2 duration-200">
              {renderStepContent()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-5 py-4 sm:px-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (step === "type") {
                    onOpenChange(false);
                    return;
                  }
                  if (step === "config") setStep("type");
                  if (step === "chapter") setStep("config");
                  if (step === "count") setStep(assessmentType === "quiz" ? "chapter" : "config");
                  if (step === "mode") setStep("count");
                  if (step === "manual") setStep("mode");
                  if (step === "review") setStep(creationMode === "manual" ? "manual" : "mode");
                  if (step === "publish") setStep("review");
                }}
              >
                Retour
              </Button>

              <div className="flex flex-wrap gap-2">
                {step === "type" && (
                  <Button type="button" onClick={() => setStep("config")} disabled={!assessmentType}>
                    Continuer
                  </Button>
                )}
                {step === "config" && (
                  <Button type="button" onClick={goNextFromConfig} disabled={!canContinueConfig}>
                    Continuer
                  </Button>
                )}
                {step === "chapter" && (
                  <Button type="button" onClick={() => setStep("count")} disabled={!canContinueChapter}>
                    Continuer
                  </Button>
                )}
                {step === "count" && (
                  <Button type="button" onClick={() => setStep("mode")}>
                    Continuer
                  </Button>
                )}
                {step === "mode" && (
                  <Button type="button" onClick={handleModeContinue} disabled={!canContinueMode}>
                    Continuer
                  </Button>
                )}
                {step === "manual" && (
                  <Button type="button" onClick={() => setStep("review")} disabled={!manualQuestionsValid}>
                    Revoir toutes les questions
                  </Button>
                )}
                {step === "review" && (
                  <Button type="button" onClick={() => setStep("publish")}>
                    Continuer vers le résumé
                  </Button>
                )}
                {step === "publish" && (
                  <Button type="button" onClick={handlePublish}>
                    Publier Quiz / Examen
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssessmentDialog;