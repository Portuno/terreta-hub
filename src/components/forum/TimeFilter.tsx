import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimeFilter = ({ value, onValueChange }: TimeFilterProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tiempo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tiempos</SelectItem>
          <SelectItem value="week">Última semana</SelectItem>
          <SelectItem value="month">Último mes</SelectItem>
          <SelectItem value="year">Último año</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};