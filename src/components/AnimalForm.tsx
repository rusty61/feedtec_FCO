import React, { useState } from 'react';
import { Plus, Save, X, Scale, Calendar } from 'lucide-react';
import { Animal, WeightRecord } from '../types';

interface AnimalFormProps {
  onSubmit: (animal: Omit<Animal, 'id' | 'feedData' | 'costData' | 'weightRecords' | 'supplementCosts'>) => void;
  onCancel: () => void;
  initialData?: Partial<Animal>;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    penName: initialData?.penName || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    finishDate: initialData?.finishDate || '',
    animalCount: initialData?.animalCount || 1,
    entryWeightPerAnimal: initialData?.entryWeightPerAnimal || 0,
    currentWeightPerAnimal: initialData?.currentWeightPerAnimal || 0,
    targetWeightPerAnimal: initialData?.targetWeightPerAnimal || 0,
    breed: initialData?.breed || '',
    status: initialData?.status || 'active' as const
  });

  // Current weight tracking
  const [currentWeightDate, setCurrentWeightDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [weightNotes, setWeightNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const totalEntryWeight = formData.animalCount * formData.entryWeightPerAnimal;
  const totalCurrentWeight = formData.animalCount * formData.currentWeightPerAnimal;
  const totalWeightGain = totalCurrentWeight - totalEntryWeight;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? 'Edit Pen' : 'Add New Pen'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="penName" className="block text-sm font-medium text-gray-700 mb-2">
              Pen Name *
            </label>
            <input
              type="text"
              id="penName"
              name="penName"
              value={formData.penName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Pen A-01"
            />
          </div>

          <div>
            <label htmlFor="animalCount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Animals *
            </label>
            <input
              type="number"
              id="animalCount"
              name="animalCount"
              value={formData.animalCount || ''}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Angus Cross"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="finished">Finished</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="finishDate" className="block text-sm font-medium text-gray-700 mb-2">
              Finish Date
            </label>
            <input
              type="date"
              id="finishDate"
              name="finishDate"
              value={formData.finishDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="entryWeightPerAnimal" className="block text-sm font-medium text-gray-700 mb-2">
              Entry Weight per Animal (kg) *
            </label>
            <input
              type="number"
              id="entryWeightPerAnimal"
              name="entryWeightPerAnimal"
              value={formData.entryWeightPerAnimal || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="33.0"
            />
          </div>

          <div>
            <label htmlFor="currentWeightPerAnimal" className="block text-sm font-medium text-gray-700 mb-2">
              Current Weight per Animal (kg) *
            </label>
            <input
              type="number"
              id="currentWeightPerAnimal"
              name="currentWeightPerAnimal"
              value={formData.currentWeightPerAnimal || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="50.0"
            />
          </div>

          <div>
            <label htmlFor="targetWeightPerAnimal" className="block text-sm font-medium text-gray-700 mb-2">
              Target Weight per Animal (kg)
            </label>
            <input
              type="number"
              id="targetWeightPerAnimal"
              name="targetWeightPerAnimal"
              value={formData.targetWeightPerAnimal || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="110.0"
            />
          </div>
        </div>

        {/* Current Weight Tracking Section */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-4">
            <Scale className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="text-sm font-medium text-blue-900">Current Weight Tracking</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentWeightDate" className="block text-sm font-medium text-blue-800 mb-2">
                Weight Measurement Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="currentWeightDate"
                  value={currentWeightDate}
                  onChange={(e) => setCurrentWeightDate(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="weightNotes" className="block text-sm font-medium text-blue-800 mb-2">
                Weight Notes (Optional)
              </label>
              <input
                type="text"
                id="weightNotes"
                value={weightNotes}
                onChange={(e) => setWeightNotes(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Morning weighing, after feeding"
              />
            </div>
          </div>

          <div className="mt-3 text-sm text-blue-800">
            <p><strong>Note:</strong> The current weight and date will be used to calculate accurate FCO ratios and daily gain rates. 
            After creating the pen, you can add additional weight measurements through the pen management interface.</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Pen Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Entry Weight:</span>
              <div className="font-semibold text-gray-900">{totalEntryWeight.toFixed(1)} kg</div>
            </div>
            <div>
              <span className="text-gray-600">Total Current Weight:</span>
              <div className="font-semibold text-gray-900">{totalCurrentWeight.toFixed(1)} kg</div>
            </div>
            <div>
              <span className="text-gray-600">Total Weight Gain:</span>
              <div className="font-semibold text-green-600">{totalWeightGain.toFixed(1)} kg</div>
            </div>
            <div>
              <span className="text-gray-600">Gain per Animal:</span>
              <div className="font-semibold text-green-600">
                {formData.animalCount > 0 ? (totalWeightGain / formData.animalCount).toFixed(1) : '0.0'} kg
              </div>
            </div>
          </div>
          
          {/* Weight measurement info */}
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Weight Measurement Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(currentWeightDate).toLocaleDateString()}
              </span>
            </div>
            {weightNotes && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Notes:</span>
                <span className="font-medium text-gray-900 italic">"{weightNotes}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Feeding Unit Assignment Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Feeding Unit Assignment</h4>
          <p className="text-sm text-blue-800">
            After creating this pen, you can assign a feeding unit to it in the "Feeding Units" tab. 
            Each pen should have one dedicated feeding unit for accurate FCO tracking.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {initialData ? 'Update' : 'Add'} Pen
          </button>
        </div>
      </form>
    </div>
  );
};