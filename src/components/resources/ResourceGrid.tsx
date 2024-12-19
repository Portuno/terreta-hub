import { BookOpen, GraduationCap, Link } from "lucide-react";
import { ResourceList } from "./ResourceList";

interface ResourceGridProps {
  resources: any[];
  isAdmin: boolean;
  onResourceDeleted: () => void;
}

export const ResourceGrid = ({ resources, isAdmin, onResourceDeleted }: ResourceGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ResourceList
        category="guide"
        icon={<BookOpen className="w-6 h-6 text-primary" />}
        title="Guías"
        resources={resources}
        isAdmin={isAdmin}
        onResourceDeleted={onResourceDeleted}
      />

      <ResourceList
        category="course"
        icon={<GraduationCap className="w-6 h-6 text-accent" />}
        title="Cursos"
        resources={resources}
        isAdmin={isAdmin}
        onResourceDeleted={onResourceDeleted}
      />

      <ResourceList
        category="link"
        icon={<Link className="w-6 h-6 text-primary" />}
        title="Enlaces Útiles"
        resources={resources}
        isAdmin={isAdmin}
        onResourceDeleted={onResourceDeleted}
      />
    </div>
  );
};