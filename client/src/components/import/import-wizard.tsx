import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import FileUpload from "./file-upload";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function ImportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<WizardStep[]>([
    { id: 1, title: "Select Files", description: "Choose files to upload", completed: false },
    { id: 2, title: "Configure", description: "Set import settings", completed: false },
    { id: 3, title: "Process", description: "Review and process data", completed: false },
  ]);

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload />;
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Import Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Data Type</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Project Data</option>
                    <option>Task Data</option>
                    <option>Resource Data</option>
                    <option>Budget Data</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Import Mode</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Create New Records</option>
                    <option>Update Existing Records</option>
                    <option>Merge with Existing</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="validate" 
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="validate" className="ml-2 text-sm text-gray-700">
                    Validate data before import
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Processing Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your data has been successfully imported and processed.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">147</p>
                    <p className="text-sm text-gray-600">Records Imported</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600">Projects Created</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                    <p className="text-sm text-gray-600">Errors Resolved</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
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
                <p className={`font-medium ${
                  currentStep === step.id ? 'text-primary' : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-0.5 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700">
              Finish Import
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
