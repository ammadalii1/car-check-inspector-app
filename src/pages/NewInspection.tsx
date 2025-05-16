
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { InspectionData } from "@/types/inspection";
import { generateUniqueId } from "@/utils/helpers";

const NewInspection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    carModel: "",
    carYear: "",
    licensePlate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create new inspection
      const newInspection: InspectionData = {
        id: generateUniqueId(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: "pending",
        categories: {}
      };
      
      // Save to localStorage
      const existingInspections = JSON.parse(localStorage.getItem("inspections") || "[]");
      const updatedInspections = [...existingInspections, newInspection];
      localStorage.setItem("inspections", JSON.stringify(updatedInspections));
      
      toast({
        title: "Inspection created",
        description: `New inspection for ${formData.carModel} has been created successfully.`,
      });
      
      navigate(`/inspection/${newInspection.id}`);
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast({
        title: "Error",
        description: "Failed to create inspection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Start New Inspection</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carModel">Car Model</Label>
              <Input
                id="carModel"
                name="carModel"
                placeholder="e.g. Toyota Camry"
                value={formData.carModel}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carYear">Year</Label>
              <Input
                id="carYear"
                name="carYear"
                placeholder="e.g. 2022"
                value={formData.carYear}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                placeholder="e.g. ABC-123"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Start Inspection
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewInspection;
