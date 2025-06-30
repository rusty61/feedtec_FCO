import React, { useState } from 'react';
import { Edit3, Trash2, Plus, Eye, Users, Scale, Calendar, TrendingUp } from 'lucide-react';
import { Animal, WeightRecord } from '../types';
import { AnimalForm } from './AnimalForm';

interface AnimalListProps {
  animals: Animal[];
  onAddAnimal: (animal: Omit<Animal, 'id' | 'feedData' | 'costData' | 'weightRecords'>) => void;
  onUpdateAnimal: (id: string, updates: Partial<Animal>) => void;
  onDeleteAnimal: (id: string) => void;
  onAddWeightRecord?: (animalId: string, weightRecord: Omit<WeightRecord, 'id' | 'animalId'>) => void;
}

export const AnimalList: React.FC<AnimalListProps> = ({
  animals,
  onAddAnimal,
  onUpdateAnimal,
  onDeleteAnimal,
  onAddWeightRecord
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [showWeightForm, setShowWeightForm] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState({
    weightPerAnimal: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    source: 'manual' as const
  });

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setShowForm(true);
  };

  const handleSubmit = (animalData: Omit<Animal, 'id' | 'feedData' | 'costData' | 'weightRecords'>) => {
    if (editingAnimal) {
      onUpdateAnimal(editingAnimal.id, animalData);
    } else {
      onAddAnimal(animalData);
    }
    setShowForm(false);
    setEditingAnimal(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAnimal(null);
  };

  const handleAddWeight = (animalId: string) => {
    if (onAddWeightRecord && newWeight.weightPerAnimal > 0) {
      onAddWeightRecord(animalId, newWeight);
      setNewWeight({
        weightPerAnimal: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
        source: 'manual'
      });
      setShowWeightForm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLatestWeightRecord = (animal: Animal) => {
    const sorted = [...animal.weightRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  };

  const getDaysSinceLastWeighing = (animal: Animal) => {
    const latestRecord = getLatestWeightRecord(animal);
    if (!latestRecord) return 0;
    
    const today = new Date();
    const lastWeighDate = new Date(latestRecord.date);
    return Math.floor((today.getTime() - lastWeighDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (showForm) {
    return (
      <AnimalForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={editingAnimal || undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pen Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pen
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pen Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Animals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight per Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latest Weighing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Weight Gain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {animals.map((animal) => {
                const totalWeightGain = animal.animalCount * (animal.currentWeightPerAnimal - animal.entryWeightPerAnimal);
                const weightGainPerAnimal = animal.currentWeightPerAnimal - animal.entryWeightPerAnimal;
                const progressToTarget = animal.targetWeightPerAnimal 
                  ? ((animal.currentWeightPerAnimal - animal.entryWeightPerAnimal) / (animal.targetWeightPerAnimal - animal.entryWeightPerAnimal) * 100)
                  : 0;
                
                const latestWeightRecord = getLatestWeightRecord(animal);
                const daysSinceLastWeighing = getDaysSinceLastWeighing(animal);

                return (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{animal.penName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {animal.animalCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{animal.breed || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(animal.status)}`}>
                        {animal.status.charAt(0).toUpperCase() + animal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Entry: {animal.entryWeightPerAnimal} kg</div>
                      <div>Current: {animal.currentWeightPerAnimal} kg</div>
                      {animal.targetWeightPerAnimal && <div>Target: {animal.targetWeightPerAnimal} kg</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {latestWeightRecord ? (
                        <div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(latestWeightRecord.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {daysSinceLastWeighing} days ago
                          </div>
                          {latestWeightRecord.notes && (
                            <div className="text-xs text-gray-500 italic">
                              "{latestWeightRecord.notes}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No records</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {totalWeightGain.toFixed(1)} kg total
                      </div>
                      <div className="text-xs text-gray-500">
                        {weightGainPerAnimal.toFixed(1)} kg per animal
                      </div>
                      {animal.targetWeightPerAnimal && (
                        <div className="text-xs text-gray-500">
                          {progressToTarget.toFixed(0)}% to target
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowWeightForm(animal.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Add Weight Record"
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(animal)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit Pen"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAnimal(animal.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Pen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {animals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No pens added yet</p>
              <p className="text-sm">Click "Add Pen" to get started with livestock tracking</p>
            </div>
          </div>
        )}
      </div>

      {/* Weight Recording Modal */}
      {showWeightForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Weight Record</h3>
              <button
                onClick={() => setShowWeightForm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight per Animal (kg) *
                </label>
                <input
                  type="number"
                  value={newWeight.weightPerAnimal || ''}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, weightPerAnimal: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 55.5"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weighing Date *
                </label>
                <input
                  type="date"
                  value={newWeight.date}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newWeight.notes}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Morning weighing, after feeding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={newWeight.source}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, source: e.target.value as 'manual' | 'scale' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="scale">Digital Scale</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowWeightForm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddWeight(showWeightForm)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
              >
                <Scale className="h-4 w-4 mr-2" />
                Add Weight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};