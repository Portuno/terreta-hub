import { Check, HelpCircle, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventAttendanceProps {
  attendeesCount: number;
  maybeCount: number;
  notAttendingCount: number;
  userAttendance?: {
    status: string;
    is_public: boolean;
  };
  onAttendanceChange: (status: string, isPublic: boolean) => void;
  attendees: Array<{
    profiles: {
      username: string;
      avatar_url: string;
    };
  }>;
}

export const EventAttendance = ({
  attendeesCount,
  maybeCount,
  notAttendingCount,
  userAttendance,
  onAttendanceChange,
  attendees,
}: EventAttendanceProps) => {
  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Asistencia</h2>
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>{attendeesCount} asistirán</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-yellow-500" />
              <span>{maybeCount} tal vez</span>
            </div>
            <div className="flex items-center gap-2">
              <X size={16} className="text-red-500" />
              <span>{notAttendingCount} no asistirán</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            value={userAttendance?.status || ""}
            onValueChange={(value) =>
              onAttendanceChange(value, userAttendance?.is_public ?? true)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="¿Asistirás?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attending">Asistiré</SelectItem>
              <SelectItem value="maybe">Tal vez</SelectItem>
              <SelectItem value="not_attending">No asistiré</SelectItem>
            </SelectContent>
          </Select>

          {userAttendance && (
            <div className="flex items-center space-x-2">
              <Switch
                id="public-attendance"
                checked={userAttendance.is_public}
                onCheckedChange={(checked) =>
                  onAttendanceChange(userAttendance.status, checked)
                }
              />
              <Label htmlFor="public-attendance">
                Mostrar mi asistencia públicamente
              </Label>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Asistentes confirmados</h3>
        <div className="grid grid-cols-2 gap-4">
          {attendees.map((attendance) => (
            <div
              key={attendance.profiles.username}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <img
                src={attendance.profiles.avatar_url || "/placeholder.svg"}
                alt={attendance.profiles.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {attendance.profiles.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};