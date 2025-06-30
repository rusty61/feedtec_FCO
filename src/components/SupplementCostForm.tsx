import React, { useState } from 'react';
import { Save, X, Pill, DollarSign, Calendar, FileText } from 'lucide-react';
import { Animal, SupplementCost } from '../types';

interface SupplementCostFormProps {
  animals: Animal[];
  onSubmit: (animalId: string, supplement: Omit<SupplementCost, 'id' | 'animalId' | 'totalCost'>) => void;
  onCancel: () => void;
}

export const SupplementCostForm: React.FC<SupplementCostFormProps> = ({
  animals,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    animalId: '',
    supplementName: '',
    costPerAnimal: 0,
    date: new Date().toISOString().split('T')[0],
    dosage: '',
    frequency: '',
    category: 'vitamin' as SupplementCost['category'],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.animalId || !formData.supplementName || formData.costPerAnimal <= 0) return;

    const { animalId, ...supplementData } = formData;
    onSubmit(animalId, supplementData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const selectedAnimal = animals.find(a => a.id === formData.animalId);
  const totalCost = selectedAnimal ? formData.costPerAnimal * selectedAnimal.animalCount : 0;

  const supplementCategories = [
    { value: 'vitamin', label: 'Vitamin', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'mineral', label: 'Mineral', color: 'bg-blue-100 text-blue-800' },
    { value: 'probiotic', label: 'Probiotic', color: 'bg-green-100 text-green-800' },
    { value: 'medication', label: 'Medication', color: 'bg-red-100 text-red-800' },
    { value: 'growth-promoter', label: 'Growth Promoter', color: 'bg-purple-100 text-purple-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const frequencyOptions = [
    'Daily',
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'As needed',
    'One-time',
    'Custom'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Pill className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Add Supplement Cost</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pen Selection */}
            <div className="md:col-span-2">
              <label htmlFor="animalId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Pen *
              </label>
              <select
                id="animalId"
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a pen...</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.penName} ({animal.animalCount} animals)
                  </option>
                ))}
              </select>
            </div>

            {/* Supplement Name */}
            <div>
              <label htmlFor="supplementName" className="block text-sm font-medium text-gray-700 mb-2">
                Supplement Name *
              </label>
              <input
                type="text"
                id="supplementName"
                name="supplementName"
                value={formData.supplementName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Vitamin B Complex"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {supplementCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost per Animal */}
            <div>
              <label htmlFor="costPerAnimal" className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Animal ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="costPerAnimal"
                  name="costPerAnimal"
                  value={formData.costPerAnimal || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Dosage */}
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                Dosage per Animal
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 5ml, 10g, 2 tablets"
              />
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select frequency...</option>
                {frequencyOptions.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Additional notes about this supplement..."
                />
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          {selectedAnimal && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-medium text-green-900 mb-3">Cost Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Selected Pen:</span>
                  <div className="font-semibold text-green-900">{selectedAnimal.penName}</div>
                </div>
                <div>
                  <span className="text-green-700">Animal Count:</span>
                  <div className="font-semibold text-green-900">{selectedAnimal.animalCount}</div>
                </div>
                <div>
                  <span className="text-green-700">Cost per Animal:</span>
                  <div className="font-semibold text-green-900">${formData.costPerAnimal.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-green-700">Total Cost:</span>
                  <div className="font-semibold text-green-900">${totalCost.toFixed(2)}</div>
                </div>
              </div>
              
              {formData.category && (
                <div className="mt-3">
                  <span className="text-green-700">Category:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    supplementCategories.find(c => c.value === formData.category)?.color
                  }`}>
                    {supplementCategories.find(c => c.value === formData.category)?.label}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
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
              Add Supplement Cost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};