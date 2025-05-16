
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, StarOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { InspectionData, inspectionCategories } from "@/types/inspection";
import { formatDate } from "@/utils/helpers";

const InspectionReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "working":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "not-working":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "not-applicable":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return "Not rated";

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <Star className="h-4 w-4 text-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
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
          <h1 className="text-2xl font-bold">Inspection Report</h1>
          <Button onClick={() => navigate(`/inspection/${id}`)}>
            Edit Inspection
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">{inspection.carModel} ({inspection.carYear})</h2>
          <Badge className="text-sm">
            {inspection.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-500">License Plate:</span>{" "}
            <span className="font-medium">{inspection.licensePlate}</span>
          </div>
          <div>
            <span className="text-gray-500">Date Created:</span>{" "}
            <span className="font-medium">{formatDate(inspection.createdAt)}</span>
          </div>
        </div>

        {inspection.overallRating && (
          <div className="mt-4 mb-6">
            <span className="text-gray-500 mr-2">Overall Rating:</span>
            <div className="flex items-center">
              {renderStars(inspection.overallRating)}
              <span className="ml-2 font-medium">{inspection.overallRating}/5</span>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Detailed Report</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspectionCategories.map(category => {
                  const categoryData = inspection.categories[category.id];
                  if (!categoryData) return null;
                  
                  // Count the status types in this category
                  let workingCount = 0;
                  let notWorkingCount = 0;
                  let naCount = 0;
                  let totalItems = 0;
                  let ratingSum = 0;
                  let ratedItems = 0;
                  
                  Object.keys(categoryData).forEach(itemName => {
                    const item = categoryData[itemName];
                    totalItems++;
                    
                    if (item.status === "working") workingCount++;
                    else if (item.status === "not-working") notWorkingCount++;
                    else if (item.status === "not-applicable") naCount++;
                    
                    if (item.rating) {
                      ratingSum += item.rating;
                      ratedItems++;
                    }
                  });
                  
                  const avgRating = ratedItems > 0 ? Math.round((ratingSum / ratedItems) * 10) / 10 : undefined;
                  
                  return (
                    <div key={category.id} className="pb-4 border-b last:border-0">
                      <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <div className="text-green-600 font-medium">{workingCount}</div>
                          <div className="text-sm text-gray-500">Working</div>
                        </div>
                        <div>
                          <div className="text-red-600 font-medium">{notWorkingCount}</div>
                          <div className="text-sm text-gray-500">Not Working</div>
                        </div>
                        <div>
                          <div className="text-gray-600 font-medium">{naCount}</div>
                          <div className="text-sm text-gray-500">N/A</div>
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {avgRating ? (
                              <>
                                {avgRating}
                                <Star className="h-4 w-4 ml-1 text-yellow-500" />
                              </>
                            ) : (
                              "Not rated"
                            )}
                          </div>
                          <div className="text-sm text-gray-500">Avg. Rating</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inspectionCategories.map(category => {
                  const categoryData = inspection.categories[category.id];
                  if (!categoryData || Object.keys(categoryData).length === 0) return null;
                  
                  return (
                    <div key={category.id} className="pb-4 border-b last:border-0">
                      <h3 className="text-lg font-medium mb-3">{category.name}</h3>
                      <div className="space-y-3">
                        {category.items.map(itemName => {
                          const item = categoryData[itemName];
                          if (!item) return null;
                          
                          return (
                            <div key={itemName} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                              <div className="font-medium">{itemName}</div>
                              <div className="flex items-center">
                                <Badge className={`${getStatusColor(item.status)}`}>
                                  {item.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                              </div>
                              <div>{renderStars(item.rating)}</div>
                              {item.notes && (
                                <div className="md:col-span-3 bg-gray-50 p-2 rounded text-sm">
                                  <span className="font-medium">Notes:</span> {item.notes}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inspectionCategories.map(category => {
                  const categoryData = inspection.categories[category.id];
                  if (!categoryData) return null;
                  
                  // Check if there are any images in this category
                  const imagesExist = Object.values(categoryData).some(item => item.images && item.images.length > 0);
                  
                  if (!imagesExist) return null;
                  
                  return (
                    <div key={category.id} className="pb-4 border-b last:border-0">
                      <h3 className="text-lg font-medium mb-3">{category.name}</h3>
                      <div className="space-y-4">
                        {Object.entries(categoryData).map(([itemName, item]) => {
                          if (!item.images || item.images.length === 0) return null;
                          
                          return (
                            <div key={itemName} className="mb-4">
                              <h4 className="font-medium mb-2">{itemName}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {item.images.map((image, index) => (
                                  <div key={index} className="aspect-square overflow-hidden rounded-md border border-gray-200">
                                    <img src={image} alt={`${itemName} ${index + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
                {!inspectionCategories.some(category => {
                  const categoryData = inspection.categories[category.id];
                  return categoryData && Object.values(categoryData).some(item => item.images && item.images.length > 0);
                }) && (
                  <div className="text-center p-8">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t flex justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
        
        <Button onClick={() => navigate(`/inspection/${id}`)}>
          Edit Inspection
        </Button>
      </div>
    </Layout>
  );
};

export default InspectionReport;
