import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ShoppingCart, FileText, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertProcurementRequestSchema, type Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ProcurementRequestWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
}

const createProcurementRequestSchema = insertProcurementRequestSchema.extend({
  requestedBy: z.number(),
  preferredVendors: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
});

export default function ProcurementRequestWizard({ isOpen, onClose, projectId }: ProcurementRequestWizardProps) {
  const [preferredVendors, setPreferredVendors] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [newVendor, setNewVendor] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createProcurementRequestSchema>) => {
      return apiRequest("POST", "/api/procurement-requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/procurement-requests"] });
      toast({
        title: "Procurement request created",
        description: "Your request has been submitted and is ready for review.",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create procurement request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof createProcurementRequestSchema>>({
    resolver: zodResolver(createProcurementRequestSchema),
    defaultValues: {
      projectId: projectId || undefined,
      requestNumber: `PR-${Date.now()}`,
      itemName: "",
      itemDescription: "",
      category: "",
      quantity: 1,
      estimatedCost: "0.00",
      urgency: "medium",
      justification: "",
      budgetCode: "",
      status: "draft",
      requestedBy: 1, // Default to admin user
      preferredVendors: [],
      specifications: {},
    },
  });

  const resetForm = () => {
    setPreferredVendors([]);
    setSpecifications([]);
    setNewVendor("");
    setNewSpecKey("");
    setNewSpecValue("");
    form.reset();
  };

  const addVendor = () => {
    if (newVendor.trim() && !preferredVendors.includes(newVendor.trim())) {
      setPreferredVendors([...preferredVendors, newVendor.trim()]);
      setNewVendor("");
    }
  };

  const removeVendor = (index: number) => {
    setPreferredVendors(preferredVendors.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const exists = specifications.find(spec => spec.key === newSpecKey.trim());
      if (!exists) {
        setSpecifications([...specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
        setNewSpecKey("");
        setNewSpecValue("");
      }
    }
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof createProcurementRequestSchema>) => {
    const requestData = {
      ...data,
      preferredVendors,
      specifications: specifications.reduce((acc, spec) => ({
        ...acc,
        [spec.key]: spec.value
      }), {}),
    };
    createRequestMutation.mutate(requestData);
  };

  const urgencyColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Create Procurement Request</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Request Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the item" 
                          {...field} 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="materials">Materials</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="supplies">Supplies</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Priority and Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Priority & Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-green-100 text-green-800">Low</Badge>
                                <span>Standard processing</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                                <span>Normal priority</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-orange-100 text-orange-800">High</Badge>
                                <span>Expedited processing</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="urgent">
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                                <span>Immediate attention</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required By</FormLabel>
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
                  name="justification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Justification</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why this procurement is necessary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Budget allocation code" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preferred Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Vendors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add vendor name"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addVendor()}
                  />
                  <Button type="button" onClick={addVendor} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {preferredVendors.map((vendor, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{vendor}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeVendor(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Specification"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                  />
                  <Input
                    placeholder="Value/Requirement"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                  />
                  <Button type="button" onClick={addSpecification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{spec.key}:</span>
                        <span className="text-sm text-gray-600 ml-2">{spec.value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={createRequestMutation.isPending}
                  onClick={() => form.setValue("status", "draft")}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  disabled={createRequestMutation.isPending}
                  onClick={() => form.setValue("status", "submitted")}
                >
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}