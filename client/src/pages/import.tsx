import Header from "@/components/layout/header";
import ImportWizard from "@/components/import/import-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";
import type { ImportedFile } from "@shared/schema";

export default function Import() {
  const { data: importedFiles, isLoading } = useQuery<ImportedFile[]>({
    queryKey: ["/api/import"],
  });

  const statusColors = {
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    processing: Clock,
    completed: CheckCircle,
    failed: AlertCircle,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalFiles = importedFiles?.length || 0;
  const completedFiles = importedFiles?.filter(f => f.status === "completed").length || 0;
  const processingFiles = importedFiles?.filter(f => f.status === "processing").length || 0;
  const failedFiles = importedFiles?.filter(f => f.status === "failed").length || 0;

  return (
    <div>
      <Header 
        title="Data Import" 
        subtitle="Upload and process your project data files"
      />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Files</p>
                  <p className="text-3xl font-semibold text-gray-900">{totalFiles}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="text-3xl font-semibold text-gray-900">{processingFiles}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-semibold text-gray-900">{completedFiles}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-3xl font-semibold text-gray-900">{failedFiles}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Wizard */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Import Data Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ImportWizard />
              </CardContent>
            </Card>
          </div>

          {/* Import History */}
          <div>
            <Card className="data-table">
              <CardHeader>
                <CardTitle>Recent Imports</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3 py-3">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !importedFiles || importedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No import history found.</p>
                    <p className="text-sm text-gray-400">Start by uploading your first file.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {importedFiles.slice(0, 10).map((file) => {
                      const StatusIcon = statusIcons[file.status as keyof typeof statusIcons];
                      return (
                        <div key={file.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                          <StatusIcon className={`w-5 h-5 ${
                            file.status === 'completed' ? 'text-green-500' :
                            file.status === 'processing' ? 'text-yellow-500' :
                            'text-red-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={statusColors[file.status as keyof typeof statusColors]}>
                                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</span>
                            </div>
                            {file.processedData && (
                              <p className="text-xs text-gray-500 mt-1">
                                {typeof file.processedData === 'object' && file.processedData && 'records' in file.processedData 
                                  ? `${(file.processedData as any).records} records processed`
                                  : "Processed successfully"
                                }
                              </p>
                            )}
                            {file.errorMessage && (
                              <p className="text-xs text-red-600 mt-1">{file.errorMessage}</p>
                            )}
                          </div>
                          {file.status === 'completed' && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Import Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Supported Formats</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CSV files (.csv)</li>
                    <li>• Excel files (.xlsx, .xls)</li>
                    <li>• PDF documents (.pdf)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">File Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Maximum file size: 50MB</li>
                    <li>• UTF-8 encoding for text files</li>
                    <li>• First row should contain headers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data Types</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Project information</li>
                    <li>• Task lists and schedules</li>
                    <li>• Resource allocations</li>
                    <li>• Budget and cost data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
