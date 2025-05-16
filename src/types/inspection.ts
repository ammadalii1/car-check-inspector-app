
export interface InspectionItem {
  status: "working" | "not-working" | "not-applicable";
  images: string[];
  notes?: string;
}

export interface CategoryData {
  [itemName: string]: InspectionItem;
}

export interface InspectionData {
  id: string;
  carModel: string;
  carYear: string;
  licensePlate: string;
  createdAt: string;
  status: "pending" | "in-progress" | "completed";
  categories: {
    [categoryName: string]: CategoryData;
  };
}

export interface InspectionCategory {
  id: string;
  name: string;
  items: string[];
}

export const inspectionCategories: InspectionCategory[] = [
  {
    id: "body-paint",
    name: "Body Paint",
    items: ["Front Bumper", "Rear Bumper", "Hood", "Roof", "Left Fender", "Right Fender", "Left Door", "Right Door"]
  },
  {
    id: "poshish",
    name: "Poshish",
    items: ["Seats", "Dashboard", "Roof Interior", "Door Panels", "Floor Mats"]
  },
  {
    id: "dash-roof-controls",
    name: "Dash/Roof Controls",
    items: ["A/C Control", "Infotainment System", "Dashboard Lights", "Sunroof Control", "Interior Lights"]
  },
  {
    id: "exterior-lights",
    name: "Exterior Lights",
    items: ["Headlights", "Tail Lights", "Brake Lights", "Turn Signals", "Fog Lights"]
  },
  {
    id: "tyres",
    name: "Tyres",
    items: ["Front Left Tyre", "Front Right Tyre", "Rear Left Tyre", "Rear Right Tyre", "Spare Tyre"]
  },
  {
    id: "ac-heater",
    name: "AC/Heater",
    items: ["Cooling", "Heating", "Fan Speed", "AC Compressor", "Air Vents"]
  },
  {
    id: "equipment",
    name: "Equipment",
    items: ["Jack", "Tool Kit", "First Aid Kit", "Spare Parts", "Warning Triangle"]
  },
  {
    id: "body-frame-accident",
    name: "Body Frame Accident",
    items: ["Front Impact Signs", "Rear Impact Signs", "Side Impact Signs", "Structural Damage", "Repairs"]
  },
  {
    id: "computer-checkup",
    name: "Computer Checkup",
    items: ["ECU Scan", "Error Codes", "System Status", "Computer Reset", "Software Updates"]
  },
  {
    id: "fluids-filters",
    name: "Fluids/Filters",
    items: ["Engine Oil", "Transmission Fluid", "Brake Fluid", "Coolant", "Air Filter", "Oil Filter"]
  },
  {
    id: "battery",
    name: "Battery",
    items: ["Battery Condition", "Voltage Test", "Terminal Condition", "Battery Age", "Alternator Test"]
  },
  {
    id: "mechanical-check",
    name: "Mechanical Check",
    items: ["Engine Performance", "Brakes", "Suspension", "Steering", "Exhaust"]
  },
  {
    id: "instrument-cluster",
    name: "Instrument Cluster",
    items: ["Speedometer", "Fuel Gauge", "Temperature Gauge", "Warning Lights", "Odometer"]
  },
  {
    id: "car-frame",
    name: "Car Frame",
    items: ["Chassis", "Undercarriage", "Rust Spots", "Frame Alignment", "Welding Points"]
  },
  {
    id: "car-pictures",
    name: "Car Pictures",
    items: ["Front View", "Rear View", "Right Side", "Left Side", "Interior", "Engine Bay"]
  },
  {
    id: "exhaust-check",
    name: "Exhaust Check",
    items: ["Muffler Condition", "Exhaust Pipe", "Catalytic Converter", "Exhaust Smoke", "Leaks"]
  },
  {
    id: "engine-cooling-system",
    name: "Engine Cooling System",
    items: ["Radiator", "Water Pump", "Coolant Lines", "Thermostat", "Cooling Fan"]
  },
  {
    id: "transmission-check",
    name: "Transmission Check / Power Train",
    items: ["Shifting", "Clutch", "Gears", "Transmission Noise", "Drive Shaft", "CV Joints"]
  },
  {
    id: "document-verification",
    name: "Document Verification",
    items: ["Registration", "Insurance", "Service History", "Warranty", "Previous Inspection Reports"]
  },
  {
    id: "mirrors",
    name: "Mirrors",
    items: ["Side Mirrors", "Rear View Mirror", "Mirror Controls", "Auto-dim Feature", "Mirror Heating"]
  },
  {
    id: "seats",
    name: "Seats",
    items: ["Driver Seat", "Passenger Seat", "Rear Seats", "Seat Belts", "Seat Controls", "Seat Heating/Cooling"]
  },
  {
    id: "steering-controls",
    name: "Steering Controls",
    items: ["Steering Wheel", "Steering Column", "Power Steering", "Steering Controls", "Horn"]
  },
  {
    id: "windows-locking",
    name: "Power/Manual Windows & Central Locking",
    items: ["Power Windows", "Window Controls", "Central Locking", "Remote Key", "Door Locks"]
  }
];
