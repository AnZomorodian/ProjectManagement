import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle: string;
  onNewProject?: () => void;
}

export default function Header({ title, subtitle, onNewProject }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          {onNewProject && (
            <Button onClick={onNewProject} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
