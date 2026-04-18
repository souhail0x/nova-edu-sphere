import React, { useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Heading1, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      exec("insertImage", reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const tools = [
    { icon: Heading1, cmd: () => exec("formatBlock", "<h2>"), label: "Titre 1" },
    { icon: Heading2, cmd: () => exec("formatBlock", "<h3>"), label: "Titre 2" },
    { icon: Bold, cmd: () => exec("bold"), label: "Gras" },
    { icon: Italic, cmd: () => exec("italic"), label: "Italique" },
    { icon: Underline, cmd: () => exec("underline"), label: "Souligné" },
    { icon: List, cmd: () => exec("insertUnorderedList"), label: "Liste" },
    { icon: ListOrdered, cmd: () => exec("insertOrderedList"), label: "Liste num." },
  ];

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-2">
        {tools.map((t, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t.label}
            onClick={t.cmd}
          >
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Insérer une image"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImage} />
      </div>
      <div
        ref={editorRef}
        className="min-h-[260px] max-h-[400px] overflow-y-auto p-4 text-sm focus:outline-none prose prose-sm max-w-none"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichTextEditor;
