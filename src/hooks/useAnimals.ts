import { useState, useEffect, useMemo } from 'react';
import { Animal, FCOData, DashboardStats, WeightRecord, SupplementCost, PenCostBreakdown } from '../types';

export const useAnimals = (feedCostPerKg: number) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data - in production this would come from a backend
    const sampleAnimals: Animal[] = [
      {
        id: '1',
        penName: 'Pen A-01',
        startDate: '2025-01-02',
        finishDate: '2025-03-03',
        animalCount: 100,
        entryWeightPerAnimal: 33,
        currentWeightPerAnimal: 50,
        targetWeightPerAnimal: 110,
        breed: 'Angus Cross',
        status: 'finished',
        feedData: [
          {
            id: 'f1',
            animalId: '1',
            date: '2025-03-03',
            feedType: 'Mixed Feed',
            amount: 2500, // Total feed for entire pen
            cost: 3750,
            source: 'blynk',
            unitId: 'unit1'
          }
        ],
        costData: [
          {
            id: 'c1',
            animalId: '1',
            date: '2025-03-03',
            type: 'feed',
            description: 'Mixed Feed - Total Pen',
            amount: 3750
          },
          {
            id: 'c1s',
            animalId: '1',
            date: '2025-02-15',
            type: 'supplement',
            description: 'Vitamin B Complex',
            amount: 450
          }
        ],
        supplementCosts: [
          {
            id: 's1',
            animalId: '1',
            date: '2025-02-15',
            supplementName: 'Vitamin B Complex',
            costPerAnimal: 4.50,
            totalCost: 450,
            dosage: '5ml',
            frequency: 'Weekly',
            category: 'vitamin',
            notes: 'Stress reduction during transport'
          },
          {
            id: 's2',
            animalId: '1',
            date: '2025-02-20',
            supplementName: 'Mineral Mix',
            costPerAnimal: 2.25,
            totalCost: 225,
            dosage: '50g',
            frequency: 'Daily',
            category: 'mineral'
          }
        ],
        weightRecords: [
          {
            id: 'w1',
            animalId: '1',
            date: '2025-01-02',
            weightPerAnimal: 33,
            totalWeight: 3300,
            notes: 'Entry weight',
            source: 'manual'
          },
          {
            id: 'w2',
            animalId: '1',
            date: '2025-02-01',
            weightPerAnimal: 42,
            totalWeight: 4200,
            notes: 'Monthly weighing',
            source: 'scale'
          },
          {
            id: 'w3',
            animalId: '1',
            date: '2025-03-03',
            weightPerAnimal: 50,
            totalWeight: 5000,
            notes: 'Final weight',
            source: 'scale'
          }
        ]
      },
      {
        id: '2',
        penName: 'Pen B-01',
        startDate: '2025-01-15',
        animalCount: 75,
        entryWeightPerAnimal: 35,
        currentWeightPerAnimal: 65,
        targetWeightPerAnimal: 115,
        breed: 'Holstein Cross',
        status: 'active',
        feedData: [
          {
            id: 'f2',
            animalId: '2',
            date: '2025-01-15',
            feedType: 'Starter Feed',
            amount: 1800,
            cost: 2700,
            source: 'manual'
          }
        ],
        costData: [
          {
            id: 'c2',
            animalId: '2',
            date: '2025-01-15',
            type: 'feed',
            description: 'Starter Feed - Total Pen',
            amount: 2700
          },
          {
            id: 'c2s',
            animalId: '2',
            date: '2025-01-20',
            type: 'supplement',
            description: 'Probiotic Supplement',
            amount: 300
          }
        ],
        supplementCosts: [
          {
            id: 's3',
            animalId: '2',
            date: '2025-01-20',
            supplementName: 'Probiotic Supplement',
            costPerAnimal: 4.00,
            totalCost: 300,
            dosage: '10g',
            frequency: 'Daily',
            category: 'probiotic',
            notes: 'Digestive health support'
          }
        ],
        weightRecords: [
          {
            id: 'w4',
            animalId: '2',
            date: '2025-01-15',
            weightPerAnimal: 35,
            totalWeight: 2625,
            notes: 'Entry weight',
            source: 'manual'
          },
          {
            id: 'w5',
            animalId: '2',
            date: '2025-01-30',
            weightPerAnimal: 65,
            totalWeight: 4875,
            notes: 'Current weight - good progress',
            source: 'scale'
          }
        ]
      },
      {
        id: '3',
        penName: 'Pen C-02',
        startDate: '2024-12-20',
        animalCount: 120,
        entryWeightPerAnimal: 30,
        currentWeightPerAnimal: 75,
        targetWeightPerAnimal: 120,
        breed: 'Charolais Cross',
        status: 'active',
        feedData: [
          {
            id: 'f3',
            animalId: '3',
            date: '2024-12-20',
            feedType: 'Premium Feed',
            amount: 3200,
            cost: 5120,
            source: 'blynk',
            unitId: 'unit3'
          }
        ],
        costData: [
          {
            id: 'c3',
            animalId: '3',
            date: '2024-12-20',
            type: 'feed',
            description: 'Premium Feed - Total Pen',
            amount: 5120
          },
          {
            id: 'c3s1',
            animalId: '3',
            date: '2025-01-05',
            type: 'supplement',
            description: 'Growth Promoter',
            amount: 720
          },
          {
            id: 'c3s2',
            animalId: '3',
            date: '2025-01-15',
            type: 'supplement',
            description: 'Electrolyte Mix',
            amount: 240
          }
        ],
        supplementCosts: [
          {
            id: 's4',
            animalId: '3',
            date: '2025-01-05',
            supplementName: 'Growth Promoter',
            costPerAnimal: 6.00,
            totalCost: 720,
            dosage: '2ml',
            frequency: 'Bi-weekly',
            category: 'growth-promoter',
            notes: 'Enhanced weight gain'
          },
          {
            id: 's5',
            animalId: '3',
            date: '2025-01-15',
            supplementName: 'Electrolyte Mix',
            costPerAnimal: 2.00,
            totalCost: 240,
            dosage: '25g',
            frequency: 'As needed',
            category: 'other',
            notes: 'Heat stress prevention'
          }
        ],
        weightRecords: [
          {
            id: 'w6',
            animalId: '3',
            date: '2024-12-20',
            weightPerAnimal: 30,
            totalWeight: 3600,
            notes: 'Entry weight',
            source: 'manual'
          },
          {
            id: 'w7',
            animalId: '3',
            date: '2025-01-10',
            weightPerAnimal: 55,
            totalWeight: 6600,
            notes: 'Mid-period weighing',
            source: 'scale'
          },
          {
            id: 'w8',
            animalId: '3',
            date: '2025-01-25',
            weightPerAnimal: 75,
            totalWeight: 9000,
            notes: 'Latest weighing - excellent gains',
            source: 'scale'
          }
        ]
      },
      {
        id: '4',
        penName: 'Pen D-03',
        startDate: '2025-01-10',
        animalCount: 90,
        entryWeightPerAnimal: 32,
        currentWeightPerAnimal: 45,
        targetWeightPerAnimal: 105,
        breed: 'Hereford Cross',
        status: 'active',
        feedData: [
          {
            id: 'f4',
            animalId: '4',
            date: '2025-01-10',
            feedType: 'Standard Feed',
            amount: 1350,
            cost: 2025,
            source: 'blynk',
            unitId: 'unit4'
          }
        ],
        costData: [
          {
            id: 'c4',
            animalId: '4',
            date: '2025-01-10',
            type: 'feed',
            description: 'Standard Feed - Total Pen',
            amount: 2025
          },
          {
            id: 'c4s',
            animalId: '4',
            date: '2025-01-25',
            type: 'supplement',
            description: 'Mineral Supplement',
            amount: 180
          }
        ],
        supplementCosts: [
          {
            id: 's6',
            animalId: '4',
            date: '2025-01-25',
            supplementName: 'Mineral Supplement',
            costPerAnimal: 2.00,
            totalCost: 180,
            dosage: '30g',
            frequency: 'Daily',
            category: 'mineral'
          }
        ],
        weightRecords: [
          {
            id: 'w9',
            animalId: '4',
            date: '2025-01-10',
            weightPerAnimal: 32,
            totalWeight: 2880,
            notes: 'Entry weight',
            source: 'manual'
          },
          {
            id: 'w10',
            animalId: '4',
            date: '2025-01-25',
            weightPerAnimal: 45,
            totalWeight: 4050,
            notes: 'Current weight',
            source: 'scale'
          }
        ]
      }
    ];

    setTimeout(() => {
      setAnimals(sampleAnimals);
      setLoading(false);
    }, 1000);
  }, []);

  const addAnimal = (animal: Omit<Animal, 'id' | 'feedData' | 'costData' | 'weightRecords' | 'supplementCosts'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString(),
      feedData: [],
      costData: [],
      supplementCosts: [],
      weightRecords: [
        {
          id: `w${Date.now()}`,
          animalId: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          weightPerAnimal: animal.currentWeightPerAnimal,
          totalWeight: animal.currentWeightPerAnimal * animal.animalCount,
          notes: 'Initial weight entry',
          source: 'manual'
        }
      ]
    };
    setAnimals(prev => [...prev, newAnimal]);
  };

  const updateAnimal = (id: string, updates: Partial<Animal>) => {
    setAnimals(prev => prev.map(animal => 
      animal.id === id ? { ...animal, ...updates } : animal
    ));
  };

  const deleteAnimal = (id: string) => {
    setAnimals(prev => prev.filter(animal => animal.id !== id));
  };

  const addWeightRecord = (animalId: string, weightRecord: Omit<WeightRecord, 'id' | 'animalId'>) => {
    const newWeightRecord: WeightRecord = {
      ...weightRecord,
      id: `w${Date.now()}`,
      animalId,
      totalWeight: weightRecord.weightPerAnimal * (animals.find(a => a.id === animalId)?.animalCount || 1)
    };

    setAnimals(prev => prev.map(animal => {
      if (animal.id === animalId) {
        return {
          ...animal,
          currentWeightPerAnimal: weightRecord.weightPerAnimal,
          weightRecords: [...animal.weightRecords, newWeightRecord].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        };
      }
      return animal;
    }));
  };

  const addSupplementCost = (animalId: string, supplement: Omit<SupplementCost, 'id' | 'animalId' | 'totalCost'>) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    const newSupplement: SupplementCost = {
      ...supplement,
      id: `s${Date.now()}`,
      animalId,
      totalCost: supplement.costPerAnimal * animal.animalCount
    };

    // Also add to cost data
    const newCostRecord = {
      id: `c${Date.now()}`,
      animalId,
      date: supplement.date,
      type: 'supplement' as const,
      description: supplement.supplementName,
      amount: newSupplement.totalCost
    };

    setAnimals(prev => prev.map(animal => {
      if (animal.id === animalId) {
        return {
          ...animal,
          supplementCosts: [...animal.supplementCosts, newSupplement],
          costData: [...animal.costData, newCostRecord]
        };
      }
      return animal;
    }));
  };

  const calculateFCO = (animal: Animal): FCOData => {
    const totalFeedConsumed = animal.feedData.reduce((sum, feed) => sum + feed.amount, 0);
    const totalWeightGain = animal.animalCount * (animal.currentWeightPerAnimal - animal.entryWeightPerAnimal);
    const weightGainPerAnimal = animal.currentWeightPerAnimal - animal.entryWeightPerAnimal;
    
    // Use weight records for more accurate calculations
    const sortedWeightRecords = [...animal.weightRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const latestWeightRecord = sortedWeightRecords[sortedWeightRecords.length - 1];
    const previousWeightRecord = sortedWeightRecords[sortedWeightRecords.length - 2];
    
    const latestWeightDate = latestWeightRecord?.date || animal.startDate;
    const daysSinceLastWeighing = previousWeightRecord ? 
      Math.floor((new Date(latestWeightDate).getTime() - new Date(previousWeightRecord.date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const weightGainSinceLastWeighing = previousWeightRecord ? 
      (latestWeightRecord.weightPerAnimal - previousWeightRecord.weightPerAnimal) : 0;
    
    const startDate = new Date(animal.startDate);
    const currentDate = animal.finishDate ? new Date(animal.finishDate) : new Date(latestWeightDate);
    const daysOnFeed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyGainPerAnimal = daysOnFeed > 0 ? weightGainPerAnimal / daysOnFeed : 0;
    const currentFCO = totalWeightGain > 0 ? totalFeedConsumed / totalWeightGain : 0;
    const feedEfficiency = currentFCO > 0 ? 1 / currentFCO : 0;
    const totalCost = animal.costData.reduce((sum, cost) => sum + cost.amount, 0);
    const costPerKg = totalWeightGain > 0 ? totalCost / totalWeightGain : 0;
    const costPerAnimal = animal.animalCount > 0 ? totalCost / animal.animalCount : 0;

    // Calculate supplement costs
    const totalSupplementCost = animal.supplementCosts.reduce((sum, supplement) => sum + supplement.totalCost, 0);
    const supplementCostPerAnimal = animal.animalCount > 0 ? totalSupplementCost / animal.animalCount : 0;
    const supplementCostPerKg = totalWeightGain > 0 ? totalSupplementCost / totalWeightGain : 0;

    return {
      animalId: animal.id,
      penName: animal.penName,
      animalCount: animal.animalCount,
      currentFCO,
      totalFeedConsumed,
      totalWeightGain,
      weightGainPerAnimal,
      daysOnFeed,
      dailyGainPerAnimal,
      feedEfficiency,
      totalCost,
      costPerKg,
      costPerAnimal,
      latestWeightDate,
      weightGainSinceLastWeighing,
      daysSinceLastWeighing,
      totalSupplementCost,
      supplementCostPerAnimal,
      supplementCostPerKg
    };
  };

  const getPenCostBreakdown = (animalId: string): PenCostBreakdown | null => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return null;

    const feedCosts = animal.costData.filter(c => c.type === 'feed').reduce((sum, c) => sum + c.amount, 0);
    const supplementCosts = animal.costData.filter(c => c.type === 'supplement').reduce((sum, c) => sum + c.amount, 0);
    const medicalCosts = animal.costData.filter(c => c.type === 'medical').reduce((sum, c) => sum + c.amount, 0);
    const equipmentCosts = animal.costData.filter(c => c.type === 'equipment').reduce((sum, c) => sum + c.amount, 0);
    const otherCosts = animal.costData.filter(c => c.type === 'other').reduce((sum, c) => sum + c.amount, 0);
    const totalCosts = feedCosts + supplementCosts + medicalCosts + equipmentCosts + otherCosts;
    
    const totalWeightGain = animal.animalCount * (animal.currentWeightPerAnimal - animal.entryWeightPerAnimal);
    const costPerAnimal = animal.animalCount > 0 ? totalCosts / animal.animalCount : 0;
    const costPerKgGained = totalWeightGain > 0 ? totalCosts / totalWeightGain : 0;

    // Supplement breakdown by category
    const supplementBreakdown = animal.supplementCosts.reduce((acc, supplement) => {
      const existing = acc.find(item => item.category === supplement.category);
      if (existing) {
        existing.cost += supplement.totalCost;
      } else {
        acc.push({
          category: supplement.category,
          cost: supplement.totalCost,
          percentage: 0 // Will be calculated below
        });
      }
      return acc;
    }, [] as { category: string; cost: number; percentage: number }[]);

    // Calculate percentages
    supplementBreakdown.forEach(item => {
      item.percentage = supplementCosts > 0 ? (item.cost / supplementCosts) * 100 : 0;
    });

    return {
      penId: animal.id,
      penName: animal.penName,
      feedCosts,
      supplementCosts,
      medicalCosts,
      equipmentCosts,
      otherCosts,
      totalCosts,
      costPerAnimal,
      costPerKgGained,
      supplementBreakdown
    };
  };

  const calculateAndMemoizeFCO = useMemo(() => {
    // This internal function will be updated in the next step to use feedCostPerKg
    const calculateFCOInternal = (animal: Animal): FCOData => {
      const totalFeedConsumed = animal.feedData.reduce((sum, feed) => sum + feed.amount, 0);
      const totalWeightGain = animal.animalCount * (animal.currentWeightPerAnimal - animal.entryWeightPerAnimal);
      const weightGainPerAnimal = animal.currentWeightPerAnimal - animal.entryWeightPerAnimal;

      const sortedWeightRecords = [...animal.weightRecords].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const latestWeightRecord = sortedWeightRecords[sortedWeightRecords.length - 1];
      const previousWeightRecord = sortedWeightRecords[sortedWeightRecords.length - 2];

      const latestWeightDate = latestWeightRecord?.date || animal.startDate;
      const daysSinceLastWeighing = previousWeightRecord ?
        Math.floor((new Date(latestWeightDate).getTime() - new Date(previousWeightRecord.date).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      const weightGainSinceLastWeighing = previousWeightRecord ?
        (latestWeightRecord.weightPerAnimal - previousWeightRecord.weightPerAnimal) : 0;

      const startDate = new Date(animal.startDate);
      const currentDate = animal.finishDate ? new Date(animal.finishDate) : new Date(latestWeightDate);
      const daysOnFeed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const dailyGainPerAnimal = daysOnFeed > 0 ? weightGainPerAnimal / daysOnFeed : 0;
      const currentFCO = totalWeightGain > 0 ? totalFeedConsumed / totalWeightGain : 0;
      const feedEfficiency = currentFCO > 0 ? 1 / currentFCO : 0;

      // Calculate feed cost using the new feedCostPerKg
      const calculatedFeedCost = totalFeedConsumed * feedCostPerKg;
      const totalSupplementCost = animal.supplementCosts.reduce((sum, supplement) => sum + supplement.totalCost, 0);
      // Assuming other costs are still sourced from costData if they exist (e.g., medical, equipment)
      const otherNonFeedNonSupplementCosts = animal.costData
        .filter(c => c.type !== 'feed' && c.type !== 'supplement')
        .reduce((sum, c) => sum + c.amount, 0);

      const totalCost = calculatedFeedCost + totalSupplementCost + otherNonFeedNonSupplementCosts;

      const costPerKg = totalWeightGain > 0 ? totalCost / totalWeightGain : 0;
      const costPerAnimal = animal.animalCount > 0 ? totalCost / animal.animalCount : 0;
      const supplementCostPerAnimal = animal.animalCount > 0 ? totalSupplementCost / animal.animalCount : 0;
      const supplementCostPerKg = totalWeightGain > 0 ? totalSupplementCost / totalWeightGain : 0;

      return {
        animalId: animal.id,
        penName: animal.penName,
        animalCount: animal.animalCount,
        currentFCO,
        totalFeedConsumed,
        totalWeightGain,
        weightGainPerAnimal,
        daysOnFeed,
        dailyGainPerAnimal,
        feedEfficiency,
        totalCost, // Will be updated
        costPerKg, // Will be updated
        costPerAnimal, // Will be updated
        latestWeightDate,
        weightGainSinceLastWeighing,
        daysSinceLastWeighing,
        totalSupplementCost,
        supplementCostPerAnimal,
        supplementCostPerKg
      };
    };
    return animals.map(calculateFCOInternal);
  }, [animals, feedCostPerKg]); // Add feedCostPerKg to dependency array

  const getPenCostBreakdown = useMemo(() => (animalId: string): PenCostBreakdown | null => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return null;

    // Placeholder for feed cost calculation - will be updated
    const feedCosts = animal.feedData.reduce((sum, feed) => sum + (feed.amount * feedCostPerKg), 0); // Tentative update
    const supplementCosts = animal.supplementCosts.reduce((sum, s) => sum + s.totalCost, 0);
    const medicalCosts = animal.costData.filter(c => c.type === 'medical').reduce((sum, c) => sum + c.amount, 0);
    const equipmentCosts = animal.costData.filter(c => c.type === 'equipment').reduce((sum, c) => sum + c.amount, 0);
    const otherCosts = animal.costData.filter(c => c.type === 'other').reduce((sum, c) => sum + c.amount, 0);
    const totalCosts = feedCosts + supplementCosts + medicalCosts + equipmentCosts + otherCosts;

    const totalWeightGain = animal.animalCount * (animal.currentWeightPerAnimal - animal.entryWeightPerAnimal);
    const costPerAnimal = animal.animalCount > 0 ? totalCosts / animal.animalCount : 0;
    const costPerKgGained = totalWeightGain > 0 ? totalCosts / totalWeightGain : 0;

    const supplementBreakdown = animal.supplementCosts.reduce((acc, supplement) => {
      const existing = acc.find(item => item.category === supplement.category);
      if (existing) {
        existing.cost += supplement.totalCost;
      } else {
        acc.push({
          category: supplement.category,
          cost: supplement.totalCost,
          percentage: 0
        });
      }
      return acc;
    }, [] as { category: string; cost: number; percentage: number }[]);

    supplementBreakdown.forEach(item => {
      item.percentage = supplementCosts > 0 ? (item.cost / supplementCosts) * 100 : 0;
    });

    return {
      penId: animal.id,
      penName: animal.penName,
      feedCosts, // Will be updated
      supplementCosts,
      medicalCosts,
      equipmentCosts,
      otherCosts,
      totalCosts, // Will be updated
      costPerAnimal, // Will be updated
      costPerKgGained, // Will be updated
      supplementBreakdown
    };
  }, [animals, feedCostPerKg]); // Add feedCostPerKg

  const getDashboardStats = useMemo(() => (): DashboardStats => {
    const activePens = animals.filter(a => a.status === 'active');
    // Use the memoized fcoData (calculateAndMemoizeFCO)
    const currentFcoData = calculateAndMemoizeFCO;
    
    return {
      totalPens: animals.length,
      totalAnimals: animals.reduce((sum, animal) => sum + animal.animalCount, 0),
      activePens: activePens.length,
      activeAnimals: activePens.reduce((sum, animal) => sum + animal.animalCount, 0),
      averageFCO: currentFcoData.reduce((sum, data) => sum + data.currentFCO, 0) / animals.length || 0,
      totalFeedConsumed: currentFcoData.reduce((sum, data) => sum + data.totalFeedConsumed, 0),
      totalCost: currentFcoData.reduce((sum, data) => sum + data.totalCost, 0), // This will reflect new costs
      averageDailyGainPerAnimal: currentFcoData.reduce((sum, data) => sum + data.dailyGainPerAnimal, 0) / animals.length || 0,
      totalWeightGain: currentFcoData.reduce((sum, data) => sum + data.totalWeightGain, 0)
    };
  }, [animals, calculateAndMemoizeFCO, feedCostPerKg]); // Added feedCostPerKg and calculateAndMemoizeFCO

  return {
    animals,
    loading,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    addWeightRecord,
    addSupplementCost,
    // calculateFCO is now internal to calculateAndMemoizeFCO
    getPenCostBreakdown, // This is now a memoized function
    getDashboardStats,   // This is now a memoized function
    fcoData: calculateAndMemoizeFCO // Export the memoized FCO data
  };
};