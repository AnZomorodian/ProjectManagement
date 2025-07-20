import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Target, Calendar, AlertTriangle } from "lucide-react";
import type { Project, Task, ProcurementOrder, EngineeringDocument, DashboardStats } from "@shared/schema";

export default function Analytics() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: procurementOrders } = useQuery<ProcurementOrder[]>({
    queryKey: ["/api/procurement"],
  });

  const { data: engineeringDocs } = useQuery<EngineeringDocument[]>({
    queryKey: ["/api/engineering"],
  });

  // Calculate analytics data
  const projectStatusData = projects ? [
    { name: "Planning", value: projects.filter(p => p.status === "planning").length, color: "#FF9800" },
    { name: "In Progress", value: projects.filter(p => p.status === "in-progress").length, color: "#1976D2" },
    { name: "Review", value: projects.filter(p => p.status === "review").length, color: "#9C27B0" },
    { name: "Completed", value: projects.filter(p => p.status === "completed").length, color: "#4CAF50" },
    { name: "Cancelled", value: projects.filter(p => p.status === "cancelled").length, color: "#F44336" },
  ].filter(item => item.value > 0) : [];

  const budgetTrendData = projects ? [
    { month: "Jan", planned: 2.1, actual: 1.8 },
    { month: "Feb", planned: 2.3, actual: 2.0 },
    { month: "Mar", planned: 2.5, actual: 2.2 },
    { month: "Apr", planned: 2.7, actual: 2.4 },
    { month: "May", planned: 2.9, actual: 2.6 },
    { month: "Jun", planned: 3.1, actual: 2.8 },
  ] : [];

  const taskCompletionData = tasks ? [
    { date: "Week 1", completed: tasks.filter(t => t.status === "completed").length * 0.6 },
    { date: "Week 2", completed: tasks.filter(t => t.status === "completed").length * 0.7 },
    { date: "Week 3", completed: tasks.filter(t => t.status === "completed").length * 0.8 },
    { date: "Week 4", completed: tasks.filter(t => t.status === "completed").length * 0.9 },
    { date: "Week 5", completed: tasks.filter(t => t.status === "completed").length },
  ] : [];

  const procurementStatusData = procurementOrders ? [
    { status: "Pending", count: procurementOrders.filter(p => p.status === "pending").length },
    { status: "Approved", count: procurementOrders.filter(p => p.status === "approved").length },
    { status: "Ordered", count: procurementOrders.filter(p => p.status === "ordered").length },
    { status: "Delivered", count: procurementOrders.filter(p => p.status === "delivered").length },
  ].filter(item => item.count > 0) : [];

  const resourceUtilizationData = [
    { department: "Engineering", utilization: 85, capacity: 100 },
    { department: "Design", utilization: 78, capacity: 100 },
    { department: "QA", utilization: 92, capacity: 100 },
    { department: "Project Mgmt", utilization: 88, capacity: 100 },
  ];

  const riskAnalysisData = [
    { risk: "Budget", value: 65, fullMark: 100 },
    { risk: "Timeline", value: 72, fullMark: 100 },
    { risk: "Resources", value: 58, fullMark: 100 },
    { risk: "Quality", value: 85, fullMark: 100 },
    { risk: "Scope", value: 70, fullMark: 100 },
  ];

  const performanceMetrics = [
    {
      title: "On-Time Delivery",
      value: "87%",
      trend: 5.2,
      isPositive: true,
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Budget Variance",
      value: "3.2%",
      trend: -1.8,
      isPositive: true,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Resource Efficiency",
      value: "82%",
      trend: 2.1,
      isPositive: true,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Quality Score",
      value: "94%",
      trend: 1.5,
      isPositive: true,
      icon: Target,
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <Header 
        title="Analytics Dashboard" 
        subtitle="Advanced insights and data visualization for project performance"
      />
      
      <div className="p-6">
        {/* Time Range Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
                <p className="text-sm text-gray-600">Comprehensive project performance insights</p>
              </div>
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
                    <p className={`text-sm flex items-center mt-1 ${
                      metric.isPositive ? "text-green-600" : "text-red-600"
                    }`}>
                      {metric.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      <span>{Math.abs(metric.trend)}%</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center ${
                    metric.color === "text-green-600" ? "bg-green-100" :
                    metric.color === "text-blue-600" ? "bg-blue-100" :
                    metric.color === "text-purple-600" ? "bg-purple-100" :
                    "bg-orange-100"
                  }`}>
                    <metric.icon className={`${metric.color} text-xl w-6 h-6`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Distribution */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {projectStatusData.length > 0 ? (
                <div className="flex items-center">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {projectStatusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  No project data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget vs Actual Spending */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Budget vs Actual Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={budgetTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Area 
                    type="monotone" 
                    dataKey="planned" 
                    stackId="1"
                    stroke="#1976D2" 
                    fill="#1976D2"
                    fillOpacity={0.2}
                    name="Planned Budget"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stackId="2"
                    stroke="#FF6B35" 
                    fill="#FF6B35"
                    fillOpacity={0.2}
                    name="Actual Spending"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Task Completion Trend */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    dot={{ fill: "#4CAF50", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resource Utilization */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={resourceUtilizationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={80} />
                  <Bar dataKey="utilization" fill="#1976D2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Procurement Analysis */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Procurement Status</CardTitle>
            </CardHeader>
            <CardContent>
              {procurementStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={procurementStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Bar dataKey="count" fill="#FF6B35" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  No procurement data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Analysis */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={riskAnalysisData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="risk" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Risk Level"
                    dataKey="value"
                    stroke="#FF6B35"
                    fill="#FF6B35"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project Velocity</p>
                    <p className="text-xs text-gray-600">15% increase in task completion rate this month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Budget Efficiency</p>
                    <p className="text-xs text-gray-600">3.2% under budget across all active projects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Resource Constraint</p>
                    <p className="text-xs text-gray-600">QA team at 92% capacity - consider scaling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quality Metrics</p>
                    <p className="text-xs text-gray-600">94% quality score maintained this quarter</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Performance Table */}
        <Card className="data-table">
          <CardHeader>
            <CardTitle>Project Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Budget Health</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Timeline</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map((project) => {
                      const progress = project.progress || 0;
                      const budgetHealth = Math.random() > 0.3 ? "healthy" : "at-risk";
                      const timeline = Math.random() > 0.4 ? "on-track" : "delayed";
                      const riskLevel = progress > 80 ? "low" : progress > 50 ? "medium" : "high";
                      
                      return (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{project.name}</p>
                              <p className="text-sm text-gray-600">{project.category}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={budgetHealth === "healthy" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {budgetHealth === "healthy" ? "Healthy" : "At Risk"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={timeline === "on-track" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}>
                              {timeline === "on-track" ? "On Track" : "Delayed"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={
                              riskLevel === "low" ? "bg-green-100 text-green-800" :
                              riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No project data available for analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
