import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GuideFieldsProps {
  contentFormat: string;
  setContentFormat: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
}

export const GuideFields = ({
  contentFormat,
  setContentFormat,
  url,
  setUrl,
  duration,
  setDuration,
}: GuideFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="contentFormat">Formato del Contenido</Label>
        <Select value={contentFormat} onValueChange={setContentFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="url">URL del Contenido</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL del contenido (video, audio o documento)"
        />
      </div>
      <div>
        <Label htmlFor="duration">Duración</Label>
        <Input
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ej: 5 minutos, 1 hora"
        />
      </div>
    </>
  );
};