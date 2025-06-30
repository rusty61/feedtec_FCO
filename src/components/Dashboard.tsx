import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, DollarSign, Scale, Target, Activity, Users, Calendar, Eye, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardStats, FCOData, HistoricalFCOData, PenMetrics } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  fcoData: FCOData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, fcoData }) => {
  const [selectedPenId, setSelectedPenId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [historicalDays, setHistoricalDays] = useState<number>(30);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatNumber = (num: number, decimals = 2) => 
    num.toFixed(decimals);

  // Get filtered data based on selected pen
  const getFilteredData = () => {
    if (selectedPenId === 'all') {
      return {
        fcoData: fcoData,
        totalPens: fcoData.length,
        totalAnimals: fcoData.reduce((sum, pen) => sum + pen.animalCount, 0),
        averageFCO: fcoData.length > 0 ? fcoData.reduce((sum, pen) => sum + pen.currentFCO, 0) / fcoData.length : 0,
        averageDailyGain: fcoData.length > 0 ? fcoData.reduce((sum, pen) => sum + pen.dailyGainPerAnimal, 0) / fcoData.length : 0
      };
    } else {
      const selectedPen = fcoData.find(pen => pen.animalId === selectedPenId);
      return {
        fcoData: selectedPen ? [selectedPen] : [],
        totalPens: selectedPen ? 1 : 0,
        totalAnimals: selectedPen ? selectedPen.animalCount : 0,
        averageFCO: selectedPen ? selectedPen.currentFCO : 0,
        averageDailyGain: selectedPen ? selectedPen.dailyGainPerAnimal : 0,
        selectedPenName: selectedPen ? selectedPen.penName : ''
      };
    }
  };

  const filteredData = getFilteredData();

  // Generate historical FCO data with configurable days
  const generateHistoricalData = (): HistoricalFCOData[] => {
    const data: HistoricalFCOData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - historicalDays);

    for (let i = 0; i < historicalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const entry: HistoricalFCOData = {
        date: date.toISOString().split('T')[0]
      };

      // Add FCO data for filtered pens with realistic variation
      filteredData.fcoData.forEach((pen, index) => {
        const baseValue = pen.currentFCO;
        const variation = (Math.random() - 0.5) * 0.5; // ±0.25 variation
        const trendFactor = (i / historicalDays) * (index % 2 === 0 ? -0.2 : 0.1); // Some pens improve, others decline slightly
        const seasonalFactor = Math.sin((i / historicalDays) * Math.PI * 2) * 0.1; // Seasonal variation
        entry[pen.penName] = Math.max(1, baseValue + variation + trendFactor + seasonalFactor);
      });

      data.push(entry);
    }

    return data;
  };

  const historicalData = generateHistoricalData();
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const dayOptions = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' },
    { value: 60, label: '2 Months' },
    { value: 90, label: '3 Months' },
    { value: 180, label: '6 Months' },
    { value: 365, label: '12 Months' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* Pen Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Pen</label>
            <div className="relative">
              <select
                value={selectedPenId}
                onChange={(e) => setSelectedPenId(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[150px]"
              >
                <option value="all">All Pens</option>
                {fcoData.map((pen) => (
                  <option key={pen.animalId} value={pen.animalId}>
                    {pen.penName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === 'overview' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === 'detailed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Detailed View
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Key Metrics Grid - Updated with filtered data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {selectedPenId === 'all' ? 'Total Pens' : 'Selected Pen'}
                  </p>
                  {selectedPenId === 'all' ? (
                    <>
                      <p className="text-3xl font-bold text-gray-900">{filteredData.totalPens}</p>
                      <p className="text-sm text-green-600">{stats.activePens} active</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 leading-tight">{filteredData.selectedPenName}</p>
                      <p className="text-sm text-green-600">Currently selected</p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Animals</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredData.totalAnimals}</p>
                  <p className="text-sm text-blue-600">
                    {selectedPenId === 'all' ? 'All pens' : 'Selected pen'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average FCO</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(filteredData.averageFCO)}</p>
                  <p className="text-sm text-purple-600">Lower is better</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Daily Gain</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(filteredData.averageDailyGain)}</p>
                  <p className="text-sm text-orange-600">kg/day per animal</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Historical FCO Graph with Extended Time Range */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Historical FCO Trends</h3>
              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <div className="relative">
                  <select
                    value={historicalDays}
                    onChange={(e) => setHistoricalDays(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {dayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedPenId === 'all' ? 'All Pens' : fcoData.find(p => p.animalId === selectedPenId)?.penName}
                </div>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (historicalDays <= 30) {
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      } else if (historicalDays <= 90) {
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      } else {
                        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                      }
                    }}
                    interval={historicalDays > 180 ? Math.floor(historicalDays / 12) : historicalDays > 90 ? Math.floor(historicalDays / 8) : 'preserveStartEnd'}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    label={{ value: 'FCO Ratio', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    formatter={(value: number, name: string) => [formatNumber(value), name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {filteredData.fcoData.map((pen, index) => (
                    <Line
                      key={pen.animalId}
                      type="monotone"
                      dataKey={pen.penName}
                      stroke={colors[index % colors.length]}
                      strokeWidth={3}
                      dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, stroke: colors[index % colors.length], strokeWidth: 2, fill: 'white' }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Note:</strong> Lower FCO values indicate better feed conversion efficiency. 
              {selectedPenId !== 'all' && ' Showing data for selected pen only.'}</p>
            </div>
          </div>
        </>
      )}

      {viewMode === 'detailed' && (
        <>
          {/* Detailed Performance Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Detailed Performance Analysis
              {selectedPenId !== 'all' && ` - ${fcoData.find(p => p.animalId === selectedPenId)?.penName}`}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pen Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FCO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Weight Gain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Gain/Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days On Feed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Animal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.fcoData.map((data, index) => (
                    <tr key={data.animalId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.penName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {data.animalCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          data.currentFCO <= 5 ? 'bg-green-100 text-green-800' :
                          data.currentFCO <= 6.5 ? 'bg-blue-100 text-blue-800' :
                          data.currentFCO <= 8 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {formatNumber(data.currentFCO)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{formatNumber(data.totalWeightGain)} kg</div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(data.weightGainPerAnimal)} kg per animal
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(data.dailyGainPerAnimal)} kg/day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.daysOnFeed} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(data.totalFeedConsumed)} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(data.costPerAnimal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FCO Comparison Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              FCO Comparison
              {selectedPenId !== 'all' && ` - ${fcoData.find(p => p.animalId === selectedPenId)?.penName}`}
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData.fcoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="penName" 
                    stroke="#6b7280"
                    fontSize={12}
                    angle={filteredData.fcoData.length > 3 ? -45 : 0}
                    textAnchor={filteredData.fcoData.length > 3 ? "end" : "middle"}
                    height={filteredData.fcoData.length > 3 ? 80 : 60}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    label={{ value: 'FCO Ratio', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'FCO']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="currentFCO" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {filteredData.fcoData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">
            {selectedPenId === 'all' 
              ? 'Add some pens to start tracking FCO performance' 
              : 'Selected pen has no data available'}
          </p>
        </div>
      )}
    </div>
  );
};