import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseFields } from "./form/CourseFields";
import { GuideFields } from "./form/GuideFields";
import { LinkFields } from "./form/LinkFields";

interface ResourceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceCreated: () => void;
}

export const ResourceDialog = ({ isOpen, onOpenChange, onResourceCreated }: ResourceDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("guide");
  const [url, setUrl] = useState("");
  const [instructor, setInstructor] = useState("");
  const [courseSyllabus, setCourseSyllabus] = useState("");
  const [contentFormat, setContentFormat] = useState("text");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();

  const handleCreateResource = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (resourceType === 'link' && !url) {
        toast({
          title: "Error",
          description: "El enlace es obligatorio para recursos tipo 'Enlaces Útiles'",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("resources")
        .insert({
          title,
          description,
          category: resourceType,
          resource_type: resourceType,
          url,
          instructor: resourceType === 'course' ? instructor : null,
          course_syllabus: resourceType === 'course' ? courseSyllabus : null,
          content_format: resourceType === 'guide' ? contentFormat : null,
          duration: resourceType === 'guide' ? duration : null,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Recurso creado correctamente",
      });
      onOpenChange(false);
      onResourceCreated();
      resetForm();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el recurso",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setResourceType("guide");
    setUrl("");
    setInstructor("");
    setCourseSyllabus("");
    setContentFormat("text");
    setDuration("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Recurso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="resourceType">Tipo de Recurso</Label>
            <Select value={resourceType} onValueChange={setResourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guide">Guía</SelectItem>
                <SelectItem value="course">Curso</SelectItem>
                <SelectItem value="link">Enlace Útil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {resourceType === 'link' && (
            <LinkFields url={url} setUrl={setUrl} />
          )}

          {resourceType === 'course' && (
            <CourseFields
              instructor={instructor}
              setInstructor={setInstructor}
              courseSyllabus={courseSyllabus}
              setCourseSyllabus={setCourseSyllabus}
            />
          )}

          {resourceType === 'guide' && (
            <GuideFields
              contentFormat={contentFormat}
              setContentFormat={setContentFormat}
              url={url}
              setUrl={setUrl}
              duration={duration}
              setDuration={setDuration}
            />
          )}

          <Button onClick={handleCreateResource} className="w-full">
            Crear Recurso
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};