
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Layout from "@/components/Layout";
import { InspectionData, inspectionCategories } from "@/types/inspection";
import { toast } from "@/hooks/use-toast";
import { CategorySection } from "@/components/CategorySection";

const InspectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const storedInspections: InspectionData[] = JSON.parse(localStorage.getItem("inspections") || "[]");
      const foundInspection = storedInspections.find(insp => insp.id === id);
      
      if (foundInspection) {
        setInspection(foundInspection);
      } else {
        toast({
          title: "Not found",
          description: "Inspection could not be found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading inspection:", error);
      toast({
        title: "Error",
        description: "Failed to load inspection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleStatusChange = (newStatus: string) => {
    if (!inspection) return;

    try {
      // Update inspection status
      const updatedInspection = {
        ...inspection,
        status: newStatus as "pending" | "in-progress" | "completed"
      };

      // Update in localStorage
      const storedInspections: InspectionData[] = JSON.parse(localStorage.getItem("inspections") || "[]");
      const updatedInspections = storedInspections.map(insp => 
        insp.id === id ? updatedInspection : insp
      );
      localStorage.setItem("inspections", JSON.stringify(updatedInspections));
      
      setInspection(updatedInspection);
      toast({
        title: "Status updated",
        description: `Inspection status changed to ${newStatus.replace("-", " ")}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update inspection status",
        variant: "destructive",
      });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const updateInspectionData = (updatedInspection: InspectionData) => {
    try {
      // Update in localStorage
      const storedInspections: InspectionData[] = JSON.parse(localStorage.getItem("inspections") || "[]");
      const updatedInspections = storedInspections.map(insp => 
        insp.id === id ? updatedInspection : insp
      );
      localStorage.setItem("inspections", JSON.stringify(updatedInspections));
      
      setInspection(updatedInspection);
      toast({
        title: "Inspection updated",
        description: "Inspection details have been saved",
      });
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast({
        title: "Error",
        description: "Failed to update inspection data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!inspection) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-xl font-bold">Inspection not found</h2>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {inspection.carModel} ({inspection.carYear})
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <Select
              value={inspection.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-gray-500">License Plate:</span>{" "}
            <span className="font-medium">{inspection.licensePlate}</span>
          </div>
          <div>
            <span className="text-gray-500">Date Created:</span>{" "}
            <span className="font-medium">{new Date(inspection.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {inspectionCategories.map((category) => (
          <Collapsible
            key={category.id}
            open={expandedCategories[category.id]}
            onOpenChange={() => toggleCategory(category.id)}
            className="border rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-left">
              <h2 className="text-lg font-medium">{category.name}</h2>
              {expandedCategories[category.id] ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t">
                <CategorySection
                  category={category}
                  inspection={inspection}
                  updateInspection={updateInspectionData}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t flex justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
        
        <Button onClick={() => {
          toast({
            title: "All changes saved",
            description: "Inspection data has been updated successfully",
          });
          navigate("/dashboard");
        }}>
          Save & Exit
        </Button>
      </div>
    </Layout>
  );
};

export default InspectionDetail;
