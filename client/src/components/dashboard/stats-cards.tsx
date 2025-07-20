import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Projector, DollarSign, CheckCircle, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="stats-card animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      trend: { value: "12%", isPositive: true },
      icon: Projector,
      iconBg: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
    },
    {
      title: "Total Budget",
      value: stats.totalBudget,
      trend: { value: "5%", isPositive: false },
      icon: DollarSign,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      trend: { value: "8%", isPositive: true },
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: "Team Members",
      value: stats.teamMembers.toString(),
      trend: { value: "3%", isPositive: true },
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm flex items-center mt-1 ${
                  stat.trend.isPositive ? "text-green-600" : stat.trend.isPositive === false ? "text-yellow-600" : "text-gray-600"
                }`}>
                  {stat.trend.isPositive === true && <TrendingUp className="w-4 h-4 mr-1" />}
                  {stat.trend.isPositive === false && <TrendingDown className="w-4 h-4 mr-1" />}
                  {stat.trend.isPositive === null && <Minus className="w-4 h-4 mr-1" />}
                  <span>{stat.trend.value}</span>
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor} text-xl w-6 h-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
