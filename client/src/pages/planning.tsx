import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  Users,
  FileText,
  BarChart3,
  Download,
  Filter,
  Search,
  ShoppingCart,
  Building2,
  Briefcase,
  Package,
  Lightbulb,
  TrendingUp,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project, Task, ProcurementRequest } from "@shared/schema";
import ProjectCreationWizard from "@/components/planning/project-creation-wizard";
import ProcurementRequestWizard from "@/components/planning/procurement-request-wizard";

export default function Planning() {
  const [isProjectWizardOpen, setIsProjectWizardOpen] = useState(false);
  const [isProcurementWizardOpen, setIsProcurementWizardOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>();

  // Fetch data
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: procurementRequests, isLoading: procurementLoading } = useQuery<ProcurementRequest[]>({
    queryKey: ["/api/procurement-requests"],
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      planning: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      "on-hold": "bg-gray-100 text-gray-800 border-gray-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      submitted: "bg-blue-100 text-blue-800 border-blue-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
      urgent: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (projectsLoading || tasksLoading || procurementLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Classic Planning Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Project Planning Hub</h1>
              <p className="text-lg text-gray-600">Comprehensive project management and strategic planning workspace</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>Enterprise PMIS</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export Plans
              </Button>
              <Button 
                onClick={() => setIsProcurementWizardOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                New Procurement
              </Button>
              <Button 
                onClick={() => setIsProjectWizardOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{projects?.length || 0}</p>
                  <p className="text-sm text-blue-600">Total portfolio</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {projects?.filter(p => p.status === "completed").length || 0}
                  </p>
                  <p className="text-sm text-green-600">Successfully delivered</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {projects?.filter(p => p.status === "in-progress").length || 0}
                  </p>
                  <p className="text-sm text-orange-600">Currently active</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Procurement Requests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {procurementRequests?.length || 0}
                  </p>
                  <p className="text-sm text-purple-600">Total requests</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border">
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="procurement" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Procurement
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Project Portfolio
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Project Information</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Priority</TableHead>
                        <TableHead className="font-semibold">Progress</TableHead>
                        <TableHead className="font-semibold">Timeline</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects?.map((project) => (
                        <TableRow key={project.id} className="hover:bg-gray-50">
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">{project.name}</div>
                              <div className="text-sm text-gray-600">{project.description}</div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {project.category}
                                </Badge>
                                {project.objectives && project.objectives.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {project.objectives.length} objectives
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={project.progress} className="h-2" />
                              <span className="text-xs text-gray-600 font-medium">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              {project.startDate && (
                                <div className="text-gray-600">
                                  Start: {new Date(project.startDate).toLocaleDateString()}
                                </div>
                              )}
                              {project.dueDate && (
                                <div className="text-gray-600">
                                  Due: {new Date(project.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProjectId(project.id);
                                  setIsProcurementWizardOpen(true);
                                }}
                                className="text-green-600 hover:bg-green-50"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Procure
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="text-gray-500 space-y-4">
                              <div className="p-6 bg-gray-50 rounded-lg inline-block">
                                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold mb-2">Start Your First Project</h3>
                                <p className="text-sm mb-4">Create a comprehensive project to begin your planning journey</p>
                                <Button 
                                  onClick={() => setIsProjectWizardOpen(true)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Project
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Procurement Tab */}
          <TabsContent value="procurement" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Procurement Management
                  </CardTitle>
                  <Button 
                    onClick={() => setIsProcurementWizardOpen(true)}
                    className="bg-white text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Request Details</TableHead>
                        <TableHead className="font-semibold">Project</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Urgency</TableHead>
                        <TableHead className="font-semibold">Cost</TableHead>
                        <TableHead className="font-semibold">Required By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procurementRequests?.map((request) => {
                        const project = projects?.find(p => p.id === request.projectId);
                        return (
                          <TableRow key={request.id} className="hover:bg-gray-50">
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-900">{request.itemName}</div>
                                <div className="text-sm text-gray-600">{request.itemDescription}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {request.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Qty: {request.quantity}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium text-gray-900">
                                {project?.name || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(request.urgency)}>
                                {request.urgency}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-green-600">
                                ${parseFloat(request.estimatedCost).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {request.requiredDate ? new Date(request.requiredDate).toLocaleDateString() : "N/A"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      }) || (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="text-gray-500 space-y-4">
                              <div className="p-6 bg-gray-50 rounded-lg inline-block">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold mb-2">No Procurement Requests</h3>
                                <p className="text-sm mb-4">Create your first procurement request to get started</p>
                                <Button 
                                  onClick={() => setIsProcurementWizardOpen(true)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Request
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="text-xl flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Task Management</h3>
                  <p>Comprehensive task tracking and assignment system</p>
                  <p className="text-sm mt-2">Available in the next phase of development</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Project Timeline View</h3>
                  <p>Visual timeline and Gantt chart for project planning</p>
                  <p className="text-sm mt-2">Interactive timeline coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Planning Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Strategic Analytics</h3>
                  <p>Project performance metrics and strategic insights</p>
                  <p className="text-sm mt-2">Comprehensive analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Wizards */}
      <ProjectCreationWizard
        isOpen={isProjectWizardOpen}
        onClose={() => setIsProjectWizardOpen(false)}
      />

      <ProcurementRequestWizard
        isOpen={isProcurementWizardOpen}
        onClose={() => setIsProcurementWizardOpen(false)}
        projectId={selectedProjectId}
      />
    </div>
  );
}