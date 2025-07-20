import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Cog,
  FileUp,
  Home,
  Projector,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Engineering", href: "/engineering", icon: Cog },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart },
  { name: "Planning", href: "/planning", icon: Calendar },
  { name: "Import Data", href: "/import", icon: FileUp },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-material flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Projector className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">PMIS</h1>
            <p className="text-sm text-gray-600">Project Management</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "nav-item",
                  isActive ? "active" : ""
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
            <p className="text-xs text-gray-600 truncate">Project Manager</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
