import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Plus, X, Calendar, Target, Users, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProjectSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ProjectCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const createProjectSchema = insertProjectSchema.extend({
  createdBy: z.number(),
  objectives: z.array(z.string()).optional(),
  stakeholders: z.array(z.string()).optional(),
});

export default function ProjectCreationWizard({ isOpen, onClose }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [newStakeholder, setNewStakeholder] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState<WizardStep[]>([
    { id: 1, title: "Basic Info", description: "Project details", completed: false },
    { id: 2, title: "Objectives", description: "Goals and objectives", completed: false },
    { id: 3, title: "Stakeholders", description: "Key stakeholders", completed: false },
    { id: 4, title: "Planning", description: "Timeline and budget", completed: false },
  ]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createProjectSchema>) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Your project has been created successfully and is ready for planning.",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      category: "general",
      createdBy: 1, // Default to admin user
      objectives: [],
      stakeholders: [],
    },
  });

  const completeStep = (stepId: number) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      completeStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setObjectives([]);
    setStakeholders([]);
    setNewObjective("");
    setNewStakeholder("");
    form.reset();
    setSteps(steps.map(step => ({ ...step, completed: false })));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addStakeholder = () => {
    if (newStakeholder.trim()) {
      setStakeholders([...stakeholders, newStakeholder.trim()]);
      setNewStakeholder("");
    }
  };

  const removeStakeholder = (index: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof createProjectSchema>) => {
    const projectData = {
      ...data,
      objectives,
      stakeholders,
    };
    createProjectMutation.mutate(projectData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium">Project Objectives</h4>
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Add project objective"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              />
              <Button type="button" onClick={addObjective} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">{objective}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {objectives.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No objectives added yet</p>
                <p className="text-sm">Add specific goals for your project</p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Key Stakeholders</h4>
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Add stakeholder name and role"
                value={newStakeholder}
                onChange={(e) => setNewStakeholder(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStakeholder()}
              />
              <Button type="button" onClick={addStakeholder} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">{stakeholder}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStakeholder(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {stakeholders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No stakeholders added yet</p>
                <p className="text-sm">Add key people involved in this project</p>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium">Timeline & Budget</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Budget</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskAssessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Risk Assessment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Identify potential risks and mitigation strategies" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step Content */}
            <div className="min-h-[400px] px-4">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button 
                type="button"
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {currentStep < steps.length ? (
                  <Button type="button" onClick={nextStep}>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}