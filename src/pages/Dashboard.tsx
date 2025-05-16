
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { InspectionCard } from "@/components/InspectionCard";
import { InspectionData } from "@/types/inspection";

// Mock inspection data - in a real app, fetch from API or database
const mockInspections: InspectionData[] = [
  {
    id: "1",
    carModel: "Toyota Camry",
    carYear: "2020",
    licensePlate: "ABC-123",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    categories: {}
  },
  {
    id: "2",
    carModel: "Honda Civic",
    carYear: "2019",
    licensePlate: "XYZ-789",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress",
    categories: {}
  },
  {
    id: "3",
    carModel: "Ford Mustang",
    carYear: "2021",
    licensePlate: "DEF-456",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    categories: {}
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<InspectionData[]>([]);

  useEffect(() => {
    // In a real app, fetch inspections from API or database
    // For now, use mock data and store in localStorage if not already there
    const storedInspections = localStorage.getItem("inspections");
    if (storedInspections) {
      setInspections(JSON.parse(storedInspections));
    } else {
      setInspections(mockInspections);
      localStorage.setItem("inspections", JSON.stringify(mockInspections));
    }
  }, []);

  const handleStartNewInspection = () => {
    navigate("/new-inspection");
  };

  const pendingInspections = inspections.filter(inspection => inspection.status === "pending");
  const inProgressInspections = inspections.filter(inspection => inspection.status === "in-progress");
  const completedInspections = inspections.filter(inspection => inspection.status === "completed");

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleStartNewInspection}>Start New Inspection</Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="pending">
            Pending ({pendingInspections.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressInspections.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedInspections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingInspections.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No pending inspections</p>
            </div>
          ) : (
            pendingInspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressInspections.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No inspections in progress</p>
            </div>
          ) : (
            inProgressInspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedInspections.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No completed inspections</p>
            </div>
          ) : (
            completedInspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;
