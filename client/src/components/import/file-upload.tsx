import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FileUploadProgress } from "@/lib/types";

export default function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/import'] });
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded and is being processed.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const progressItem: FileUploadProgress = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      };

      setUploadProgress(prev => [...prev, progressItem]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(item => 
            item.id === progressItem.id 
              ? { ...item, progress: Math.min(item.progress + 10, 90) }
              : item
          )
        );
      }, 200);

      uploadMutation.mutate(file, {
        onSuccess: () => {
          clearInterval(progressInterval);
          setUploadProgress(prev => 
            prev.map(item => 
              item.id === progressItem.id 
                ? { ...item, progress: 100, status: 'completed' }
                : item
            )
          );
        },
        onError: () => {
          clearInterval(progressInterval);
          setUploadProgress(prev => 
            prev.map(item => 
              item.id === progressItem.id 
                ? { ...item, status: 'error', error: 'Upload failed' }
                : item
            )
          );
        },
      });
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`file-upload-zone ${isDragActive ? 'dragover' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="text-gray-400 text-4xl mb-4 w-12 h-12 mx-auto" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Drop files here or click to browse'}
            </h4>
            <p className="text-gray-600 mb-4">Supports CSV, Excel, PDF files up to 50MB</p>
            <Button type="button" className="bg-primary hover:bg-primary/90">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supported File Types */}
      <Card>
        <CardContent className="p-4">
          <h5 className="font-medium text-gray-900 mb-3">Supported File Types</h5>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <FileText className="text-green-500 w-5 h-5" />
              <span className="text-sm text-gray-700">CSV Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="text-green-600 w-5 h-5" />
              <span className="text-sm text-gray-700">Excel Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="text-red-500 w-5 h-5" />
              <span className="text-sm text-gray-700">PDF Files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h5 className="font-medium text-gray-900 mb-3">Upload Progress</h5>
            <div className="space-y-3">
              {uploadProgress.map((file) => (
                <div key={file.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {file.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                    {file.status === 'error' ? (
                      <p className="text-xs text-red-600">{file.error}</p>
                    ) : (
                      <Progress value={file.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
