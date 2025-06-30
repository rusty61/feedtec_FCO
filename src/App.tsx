import React, { useState } from 'react';
import { BarChart3, Users, Wifi, DollarSign, ChevronDown, Pill, TrendingUp, Scale, Calculator } from 'lucide-react';
import { useAnimals } from './hooks/useAnimals';
import { Dashboard } from './components/Dashboard';
import { AnimalList } from './components/AnimalList';
import { BlynkIntegration } from './components/BlynkIntegration';
import { SupplementCostForm } from './components/SupplementCostForm';

type TabType = 'dashboard' | 'pens' | 'integration' | 'costs';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCostPenId, setSelectedCostPenId] = useState<string>('all');
  const [showSupplementForm, setShowSupplementForm] = useState(false);
  
  const {
    animals,
    loading,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    addWeightRecord,
    addSupplementCost,
    getDashboardStats,
    getPenCostBreakdown,
    fcoData
  } = useAnimals();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'pens', name: 'Pen Management', icon: Users },
    { id: 'integration', name: 'Feeding Units', icon: Wifi },
    { id: 'costs', name: 'Cost Analysis', icon: DollarSign },
  ];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getSelectedPenCostData = () => {
    if (selectedCostPenId === 'all') {
      const totalFeedCost = fcoData.reduce((sum, pen) => sum + (pen.totalCost - pen.totalSupplementCost), 0);
      const totalSupplementCost = fcoData.reduce((sum, pen) => sum + pen.totalSupplementCost, 0);
      const totalCost = totalFeedCost + totalSupplementCost;
      const totalAnimals = fcoData.reduce((sum, pen) => sum + pen.animalCount, 0);
      const totalWeightGain = fcoData.reduce((sum, pen) => sum + pen.totalWeightGain, 0);
      
      return {
        penName: 'All Pens',
        feedCosts: totalFeedCost,
        supplementCosts: totalSupplementCost,
        totalCosts: totalCost,
        costPerAnimal: totalAnimals > 0 ? totalCost / totalAnimals : 0,
        costPerKgGained: totalWeightGain > 0 ? totalCost / totalWeightGain : 0,
        supplementBreakdown: []
      };
    } else {
      return getPenCostBreakdown(selectedCostPenId);
    }
  };

  const selectedCostData = getSelectedPenCostData();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={getDashboardStats()} fcoData={fcoData} />;
      case 'pens':
        return (
          <AnimalList
            animals={animals}
            onAddAnimal={addAnimal}
            onUpdateAnimal={updateAnimal}
            onDeleteAnimal={deleteAnimal}
            onAddWeightRecord={addWeightRecord}
          />
        );
      case 'integration':
        return <BlynkIntegration animals={animals} onUpdateAnimal={updateAnimal} />;
      case 'costs':
        return (
          <div className="space-y-6">
            {/* Cost Analysis Header with Pen Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Cost Analysis</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Pen</label>
                  <div className="relative">
                    <select
                      value={selectedCostPenId}
                      onChange={(e) => setSelectedCostPenId(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[150px]"
                    >
                      <option value="all">All Pens</option>
                      {animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.penName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  onClick={() => setShowSupplementForm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Add Supplement Cost
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cost Breakdown - {selectedCostData?.penName || 'No Data'}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calculator className="h-4 w-4 mr-2" />
                  Real-time cost tracking
                </div>
              </div>

              {selectedCostData && (
                <>
                  {/* Main Cost Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">Feed Costs</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedCostData.feedCosts)}
                      </p>
                      <p className="text-xs text-blue-600">Primary nutrition costs</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="text-sm font-medium text-green-900 mb-2">Supplement Costs</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedCostData.supplementCosts)}
                      </p>
                      <p className="text-xs text-green-600">Vitamins, minerals, additives</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="text-sm font-medium text-purple-900 mb-2">Cost per Animal</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(selectedCostData.costPerAnimal)}
                      </p>
                      <p className="text-xs text-purple-600">Total cost per head</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="text-sm font-medium text-orange-900 mb-2">Cost per Kg Gained</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(selectedCostData.costPerKgGained)}
                      </p>
                      <p className="text-xs text-orange-600">Efficiency metric</p>
                    </div>
                  </div>

                  {/* Detailed Cost Breakdown */}
                  {selectedCostPenId !== 'all' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Cost Categories */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Cost Categories</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Feed Costs:</span>
                            <span className="font-medium text-gray-900">{formatCurrency(selectedCostData.feedCosts)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Supplement Costs:</span>
                            <span className="font-medium text-gray-900">{formatCurrency(selectedCostData.supplementCosts)}</span>
                          </div>
                          {selectedCostData.medicalCosts > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Medical Costs:</span>
                              <span className="font-medium text-gray-900">{formatCurrency(selectedCostData.medicalCosts)}</span>
                            </div>
                          )}
                          {selectedCostData.equipmentCosts > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Equipment Costs:</span>
                              <span className="font-medium text-gray-900">{formatCurrency(selectedCostData.equipmentCosts)}</span>
                            </div>
                          )}
                          {selectedCostData.otherCosts > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Other Costs:</span>
                              <span className="font-medium text-gray-900">{formatCurrency(selectedCostData.otherCosts)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-300 pt-3">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-sm text-gray-900">Total Costs:</span>
                              <span className="text-gray-900">{formatCurrency(selectedCostData.totalCosts)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Supplement Breakdown */}
                      {selectedCostData.supplementBreakdown.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Supplement Breakdown</h4>
                          <div className="space-y-3">
                            {selectedCostData.supplementBreakdown.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-3 ${
                                    item.category === 'vitamin' ? 'bg-yellow-400' :
                                    item.category === 'mineral' ? 'bg-blue-400' :
                                    item.category === 'probiotic' ? 'bg-green-400' :
                                    item.category === 'growth-promoter' ? 'bg-purple-400' :
                                    item.category === 'medication' ? 'bg-red-400' :
                                    'bg-gray-400'
                                  }`}></div>
                                  <span className="text-sm text-gray-600 capitalize">
                                    {item.category.replace('-', ' ')}:
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-gray-900">{formatCurrency(item.cost)}</div>
                                  <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Cost Analysis with Weight Tracking */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Performance-Based Cost Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {(selectedCostPenId === 'all' ? fcoData : fcoData.filter(pen => pen.animalId === selectedCostPenId)).map((pen) => (
                        <div key={pen.animalId} className="bg-white rounded p-3 border">
                          <div className="font-medium text-gray-900 mb-2">{pen.penName}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Feed Cost/kg:</span>
                              <span className="font-medium">{formatCurrency((pen.totalCost - pen.totalSupplementCost) / pen.totalWeightGain)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Supplement Cost/kg:</span>
                              <span className="font-medium">{formatCurrency(pen.supplementCostPerKg)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Cost/kg:</span>
                              <span className="font-medium">{formatCurrency(pen.costPerKg)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Supplement/Animal:</span>
                              <span className="font-medium">{formatCurrency(pen.supplementCostPerAnimal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">FCO Ratio:</span>
                              <span className="font-medium">{pen.currentFCO.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Supplement Cost Form Modal */}
            {showSupplementForm && (
              <SupplementCostForm
                animals={animals}
                onSubmit={(animalId, supplement) => {
                  addSupplementCost(animalId, supplement);
                  setShowSupplementForm(false);
                }}
                onCancel={() => setShowSupplementForm(false)}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">LivestockFCO</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Feed Conversion Optimization Platform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;