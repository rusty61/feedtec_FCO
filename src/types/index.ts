export interface Animal {
  id: string;
  penName: string;
  startDate: string;
  finishDate?: string;
  animalCount: number; // Number of animals in the pen
  entryWeightPerAnimal: number; // Weight per animal at entry
  currentWeightPerAnimal: number; // Current weight per animal
  targetWeightPerAnimal?: number; // Target weight per animal
  breed?: string;
  status: 'active' | 'finished' | 'sold';
  feedData: FeedRecord[];
  costData: CostRecord[];
  weightRecords: WeightRecord[]; // New: Track all weight measurements
  supplementCosts: SupplementCost[]; // New: Track supplement costs
  blynkConfig?: BlynkPenConfig; // Blynk configuration for this pen
}

export interface WeightRecord {
  id: string;
  animalId: string;
  date: string;
  weightPerAnimal: number;
  totalWeight: number; // Calculated: weightPerAnimal * animalCount
  notes?: string;
  source: 'manual' | 'scale'; // How the weight was recorded
}

export interface SupplementCost {
  id: string;
  animalId: string;
  date: string;
  supplementName: string;
  costPerAnimal: number;
  totalCost: number; // Calculated: costPerAnimal * animalCount
  dosage?: string;
  frequency?: string;
  notes?: string;
  category: 'vitamin' | 'mineral' | 'probiotic' | 'medication' | 'growth-promoter' | 'other';
}

export interface BlynkPenConfig {
  unitId: string; // e.g., "unit1", "unit2"
  webhookUrl: string;
  deviceId: string;
  isConnected: boolean;
  lastUpdate?: string;
}

export interface FeedRecord {
  id: string;
  animalId: string;
  date: string;
  feedType: string;
  amount: number; // Total feed amount for the entire pen in kg
  cost: number;
  source: 'manual' | 'blynk';
  unitId?: string; // Which feeding unit provided this data
}

export interface CostRecord {
  id: string;
  animalId: string;
  date: string;
  type: 'feed' | 'medical' | 'equipment' | 'supplement' | 'other';
  description: string;
  amount: number;
}

export interface FCOData {
  animalId: string;
  penName: string;
  animalCount: number;
  currentFCO: number;
  totalFeedConsumed: number;
  totalWeightGain: number;
  weightGainPerAnimal: number;
  daysOnFeed: number;
  dailyGainPerAnimal: number;
  feedEfficiency: number;
  totalCost: number;
  costPerKg: number;
  costPerAnimal: number;
  latestWeightDate: string; // New: When was the last weight recorded
  weightGainSinceLastWeighing: number; // New: Weight gain since last measurement
  daysSinceLastWeighing: number; // New: Days since last weight measurement
  totalSupplementCost: number; // New: Total supplement costs
  supplementCostPerAnimal: number; // New: Supplement cost per animal
  supplementCostPerKg: number; // New: Supplement cost per kg gained
}

export interface DashboardStats {
  totalPens: number;
  totalAnimals: number;
  activePens: number;
  activeAnimals: number;
  averageFCO: number;
  totalFeedConsumed: number;
  totalCost: number;
  averageDailyGainPerAnimal: number;
  totalWeightGain: number;
}

export interface BlynkUnit {
  id: string;
  unitName: string;
  penId?: string;
  penName?: string;
  webhookUrl: string;
  deviceId: string;
  isConnected: boolean;
  lastUpdate?: string;
  recentData: BlynkFeedData[];
}

export interface BlynkFeedData {
  timestamp: string;
  feedAmount: number;
  feedType: string;
  cost?: number;
  unitId: string;
  penId?: string;
}

export interface HistoricalFCOData {
  date: string;
  [penName: string]: number | string; // Dynamic pen names as keys with FCO values
}

export interface PenMetrics {
  penId: string;
  penName: string;
  currentFCO: number;
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  daysOnFeed: number;
  totalWeightGain: number;
  feedEfficiency: number;
  costPerKg: number;
  animalCount: number;
  dailyGainPerAnimal: number;
}

export interface PenCostBreakdown {
  penId: string;
  penName: string;
  feedCosts: number;
  supplementCosts: number;
  medicalCosts: number;
  equipmentCosts: number;
  otherCosts: number;
  totalCosts: number;
  costPerAnimal: number;
  costPerKgGained: number;
  supplementBreakdown: {
    category: string;
    cost: number;
    percentage: number;
  }[];
}