
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InspectionData } from "@/types/inspection";
import { Badge } from "@/components/ui/badge";

interface InspectionCardProps {
  inspection: InspectionData;
}

export function InspectionCard({ inspection }: InspectionCardProps) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{inspection.carModel} ({inspection.carYear})</CardTitle>
          <Badge className={getStatusBadgeColor(inspection.status)}>
            {inspection.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">License Plate:</span>{" "}
            <span className="font-medium">{inspection.licensePlate}</span>
          </div>
          <div>
            <span className="text-gray-500">Date Created:</span>{" "}
            <span className="font-medium">{formatDate(inspection.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/inspection/${inspection.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
