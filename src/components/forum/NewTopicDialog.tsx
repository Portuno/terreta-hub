import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useState } from "react";

interface NewTopicDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

interface PollData {
  title: string;
  description?: string;
  options: string[];
  isMultipleChoice: boolean;
  endsAt?: Date;
}

export const NewTopicDialog = ({
  isOpen,
  onOpenChange,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
}: NewTopicDialogProps) => {
  const [includePoll, setIncludePoll] = useState(false);
  const [pollData, setPollData] = useState<PollData>({
    title: "",
    description: "",
    options: ["", ""],
    isMultipleChoice: false,
  });

  const handleAddOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Debate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Escribe el título de tu debate"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contenido</label>
            <Textarea
              placeholder="Describe tu debate en detalle"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="include-poll"
              checked={includePoll}
              onCheckedChange={setIncludePoll}
            />
            <Label htmlFor="include-poll">Incluir encuesta</Label>
          </div>

          {includePoll && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la encuesta</label>
                <Input
                  placeholder="Escribe el título de la encuesta"
                  value={pollData.title}
                  onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción (opcional)</label>
                <Textarea
                  placeholder="Describe el propósito de la encuesta"
                  value={pollData.description}
                  onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Opciones</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    disabled={pollData.options.length >= 10}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Añadir opción
                  </Button>
                </div>
                <div className="space-y-2">
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Opción ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                      {index >= 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="multiple-choice"
                  checked={pollData.isMultipleChoice}
                  onCheckedChange={(checked) => setPollData(prev => ({ ...prev, isMultipleChoice: checked }))}
                />
                <Label htmlFor="multiple-choice">Permitir selección múltiple</Label>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Publicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};