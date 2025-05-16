
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InspectionCategory, InspectionData, InspectionItem } from "@/types/inspection";
import { ImageUploader } from "@/components/ImageUploader";

interface CategorySectionProps {
  category: InspectionCategory;
  inspection: InspectionData;
  updateInspection: (updatedInspection: InspectionData) => void;
}

export function CategorySection({ category, inspection, updateInspection }: CategorySectionProps) {
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleStatusChange = (itemName: string, newStatus: string) => {
    const categoryData = inspection.categories[category.id] || {};
    const itemData = categoryData[itemName] || { status: "working", images: [] };
    
    const updatedItemData: InspectionItem = {
      ...itemData,
      status: newStatus as "working" | "not-working" | "not-applicable"
    };
    
    const updatedCategoryData = {
      ...categoryData,
      [itemName]: updatedItemData
    };
    
    const updatedInspection = {
      ...inspection,
      categories: {
        ...inspection.categories,
        [category.id]: updatedCategoryData
      }
    };
    
    updateInspection(updatedInspection);
  };

  const handleImagesUpdate = (itemName: string, images: string[]) => {
    const categoryData = inspection.categories[category.id] || {};
    const itemData = categoryData[itemName] || { status: "working", images: [] };
    
    const updatedItemData: InspectionItem = {
      ...itemData,
      images
    };
    
    const updatedCategoryData = {
      ...categoryData,
      [itemName]: updatedItemData
    };
    
    const updatedInspection = {
      ...inspection,
      categories: {
        ...inspection.categories,
        [category.id]: updatedCategoryData
      }
    };
    
    updateInspection(updatedInspection);
  };

  const handleNotesChange = (itemName: string, value: string) => {
    setNotes({
      ...notes,
      [itemName]: value
    });
  };

  const saveNotes = (itemName: string) => {
    const categoryData = inspection.categories[category.id] || {};
    const itemData = categoryData[itemName] || { status: "working", images: [] };
    
    const updatedItemData: InspectionItem = {
      ...itemData,
      notes: notes[itemName]
    };
    
    const updatedCategoryData = {
      ...categoryData,
      [itemName]: updatedItemData
    };
    
    const updatedInspection = {
      ...inspection,
      categories: {
        ...inspection.categories,
        [category.id]: updatedCategoryData
      }
    };
    
    updateInspection(updatedInspection);
  };

  const getItemData = (itemName: string) => {
    const categoryData = inspection.categories[category.id] || {};
    return categoryData[itemName] || { status: "working", images: [] };
  };

  return (
    <div className="space-y-6">
      {category.items.map((itemName) => {
        const itemData = getItemData(itemName);
        return (
          <div key={itemName} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <Label className="text-base font-medium">{itemName}</Label>
              <Select
                value={itemData.status}
                onValueChange={(value) => handleStatusChange(itemName, value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="not-working">Not Working</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <ImageUploader
                images={itemData.images}
                onImagesChange={(images) => handleImagesUpdate(itemName, images)}
              />
              
              <div>
                <Label htmlFor={`notes-${itemName}`} className="mb-2 block">Notes</Label>
                <div className="flex gap-2">
                  <Textarea
                    id={`notes-${itemName}`}
                    placeholder="Add any additional notes here..."
                    className="flex-1"
                    value={notes[itemName] || itemData.notes || ""}
                    onChange={(e) => handleNotesChange(itemName, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveNotes(itemName)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
