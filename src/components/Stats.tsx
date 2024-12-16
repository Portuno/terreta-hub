import { Users, Calendar, Briefcase } from "lucide-react";

export const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Miembros Activos</p>
          <p className="text-2xl font-bold text-primary">2,543</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Eventos Este Mes</p>
          <p className="text-2xl font-bold text-accent">48</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Proyectos Activos</p>
          <p className="text-2xl font-bold text-primary">156</p>
        </div>
      </div>
    </div>
  );
};