import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface ResourceDetailsDialogProps {
  resource: any | null;
  onOpenChange: (open: boolean) => void;
}

export const ResourceDetailsDialog = ({ resource, onOpenChange }: ResourceDetailsDialogProps) => {
  if (!resource) return null;

  return (
    <Dialog open={!!resource} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">{resource.description}</p>
          
          {resource.resource_type === 'course' && (
            <>
              <div>
                <h3 className="font-semibold mb-2">Instructor</h3>
                <p>{resource.instructor}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Programa del Curso</h3>
                <p className="whitespace-pre-line">{resource.course_syllabus}</p>
              </div>
            </>
          )}

          {resource.resource_type === 'guide' && (
            <>
              <div>
                <h3 className="font-semibold mb-2">Formato</h3>
                <p className="capitalize">{resource.content_format}</p>
              </div>
              {resource.duration && (
                <div>
                  <h3 className="font-semibold mb-2">Duración</h3>
                  <p>{resource.duration}</p>
                </div>
              )}
              {resource.url && (
                <Button
                  onClick={() => window.open(resource.url, '_blank')}
                  className="w-full"
                >
                  Acceder al Contenido
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};