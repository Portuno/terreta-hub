import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { PublicProfile } from "./PublicProfile";

interface PrivateProfileProps {
  profile: any;
}

export const PrivateProfile = ({ profile }: PrivateProfileProps) => {
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button asChild variant="outline">
          <Link to="/configuraciones" className="flex items-center gap-2">
            <Settings size={16} />
            Configuraciones
          </Link>
        </Button>
      </div>
      <PublicProfile profile={profile} />
    </div>
  );
};