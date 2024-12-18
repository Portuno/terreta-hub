import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkFieldsProps {
  url: string;
  setUrl: (value: string) => void;
}

export const LinkFields = ({ url, setUrl }: LinkFieldsProps) => {
  return (
    <div>
      <Label htmlFor="url">URL del Enlace</Label>
      <Input
        id="url"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://ejemplo.com"
        required
      />
    </div>
  );
};