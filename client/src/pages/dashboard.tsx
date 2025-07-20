import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import ProjectTable from "@/components/dashboard/project-table";
import ChartsSection from "@/components/dashboard/charts-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Bell } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div>
      <Header 
        title="Dashboard Overview" 
        subtitle="Monitor your projects and track progress"
        onNewProject={() => {
          // TODO: Implement new project modal
          console.log("New project clicked");
        }}
      />
      
      <div className="p-6">
        <StatsCards />
        
        <ChartsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProjectTable />
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/import">
                  <Button variant="ghost" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Project milestone completed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Budget alert for Project Alpha</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New team member added</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
