export interface DashboardStats {
  activeProjects: number;
  totalBudget: string;
  completionRate: number;
  teamMembers: number;
}

export interface FileUploadProgress {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ProjectStatusCount {
  status: string;
  count: number;
  percentage: number;
}
