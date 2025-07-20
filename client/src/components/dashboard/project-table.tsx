import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Project } from "@shared/schema";

const statusColors = {
  planning: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-green-100 text-green-800",
  review: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  planning: "Planning",
  "in-progress": "In Progress",
  review: "Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function ProjectTable() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <Card className="data-table">
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-2 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className="data-table">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No projects found. Create your first project to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-table">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Project Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Budget</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Progress value={project.progress || 0} className="flex-1" />
                      <span className="text-sm text-gray-600">{project.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : "Not set"}
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
