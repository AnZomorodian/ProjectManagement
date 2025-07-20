import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const projectProgressData = [
  { month: "Jan", completed: 12, ongoing: 8, planned: 5 },
  { month: "Feb", completed: 15, ongoing: 10, planned: 7 },
  { month: "Mar", completed: 18, ongoing: 12, planned: 6 },
  { month: "Apr", completed: 22, ongoing: 15, planned: 8 },
  { month: "May", completed: 25, ongoing: 18, planned: 10 },
  { month: "Jun", completed: 28, ongoing: 20, planned: 12 },
];

const resourceAllocationData = [
  { name: "Engineering", value: 45, color: "#1976D2" },
  { name: "Procurement", value: 30, color: "#FF6B35" },
  { name: "Planning", value: 25, color: "#4CAF50" },
];

const budgetTrendData = [
  { month: "Jan", budget: 2.1, spent: 1.8 },
  { month: "Feb", budget: 2.3, spent: 2.0 },
  { month: "Mar", budget: 2.5, spent: 2.2 },
  { month: "Apr", budget: 2.7, spent: 2.4 },
  { month: "May", budget: 2.9, spent: 2.6 },
  { month: "Jun", budget: 3.1, spent: 2.8 },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Project Progress Overview */}
      <Card className="lg:col-span-2 chart-container">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Progress Overview</CardTitle>
          <Select defaultValue="30days">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
              <Bar dataKey="ongoing" fill="#1976D2" name="Ongoing" />
              <Bar dataKey="planned" fill="#FF9800" name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {resourceAllocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={resourceAllocationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {resourceAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Trends */}
      <Card className="lg:col-span-3 chart-container">
        <CardHeader>
          <CardTitle>Budget Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={budgetTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#1976D2" 
                strokeWidth={2}
                name="Allocated Budget"
              />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="#FF6B35" 
                strokeWidth={2}
                name="Spent Budget"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
