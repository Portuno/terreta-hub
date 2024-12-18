import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
}

interface ProductTeamProps {
  team_members?: TeamMember[] | null;
}

export const ProductTeam = ({ team_members }: ProductTeamProps) => {
  if (!team_members || team_members.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
        <Users size={16} />
        Equipo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team_members.map((member, index) => (
          <div 
            key={index} 
            className="p-4 rounded-lg bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
          >
            <span className="font-medium text-gray-800 block">{member.name}</span>
            <p className="text-sm text-gray-500 mt-1">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};