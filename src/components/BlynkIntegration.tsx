import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Settings, AlertCircle, CheckCircle, Plus, Edit3, Trash2, Link, Unlink } from 'lucide-react';
import { BlynkUnit, BlynkFeedData, Animal } from '../types';

interface BlynkIntegrationProps {
  animals?: Animal[];
  onUpdateAnimal?: (id: string, updates: Partial<Animal>) => void;
}

export const BlynkIntegration: React.FC<BlynkIntegrationProps> = ({ animals = [], onUpdateAnimal }) => {
  const [units, setUnits] = useState<BlynkUnit[]>([]);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BlynkUnit | null>(null);
  const [newUnit, setNewUnit] = useState({
    unitName: '',
    webhookUrl: '',
    deviceId: '',
    penId: ''
  });

  useEffect(() => {
    // Initialize with sample units
    const sampleUnits: BlynkUnit[] = [
      {
        id: '1',
        unitName: 'Feeding Unit 1',
        penId: '1',
        penName: 'Pen A-01',
        webhookUrl: 'https://your-app.com/webhook/unit1',
        deviceId: 'blynk-feeder-001',
        isConnected: true,
        lastUpdate: new Date().toISOString(),
        recentData: [
          {
            timestamp: new Date().toISOString(),
            feedAmount: 125.5,
            feedType: 'mixed-feed',
            cost: 188.25,
            unitId: '1',
            penId: '1'
          }
        ]
      },
      {
        id: '2',
        unitName: 'Feeding Unit 2',
        penId: '2',
        penName: 'Pen B-01',
        webhookUrl: 'https://your-app.com/webhook/unit2',
        deviceId: 'blynk-feeder-002',
        isConnected: false,
        recentData: []
      }
    ];
    setUnits(sampleUnits);
  }, []);

  const handleAddUnit = () => {
    if (!newUnit.unitName || !newUnit.webhookUrl || !newUnit.deviceId) return;

    const selectedPen = animals.find(a => a.id === newUnit.penId);
    const unit: BlynkUnit = {
      id: Date.now().toString(),
      unitName: newUnit.unitName,
      penId: newUnit.penId || undefined,
      penName: selectedPen?.penName,
      webhookUrl: newUnit.webhookUrl,
      deviceId: newUnit.deviceId,
      isConnected: false,
      recentData: []
    };

    setUnits(prev => [...prev, unit]);
    setNewUnit({ unitName: '', webhookUrl: '', deviceId: '', penId: '' });
    setShowAddUnit(false);
  };

  const handleEditUnit = (unit: BlynkUnit) => {
    setEditingUnit(unit);
    setNewUnit({
      unitName: unit.unitName,
      webhookUrl: unit.webhookUrl,
      deviceId: unit.deviceId,
      penId: unit.penId || ''
    });
    setShowAddUnit(true);
  };

  const handleUpdateUnit = () => {
    if (!editingUnit || !newUnit.unitName || !newUnit.webhookUrl || !newUnit.deviceId) return;

    const selectedPen = animals.find(a => a.id === newUnit.penId);
    const updatedUnit: BlynkUnit = {
      ...editingUnit,
      unitName: newUnit.unitName,
      penId: newUnit.penId || undefined,
      penName: selectedPen?.penName,
      webhookUrl: newUnit.webhookUrl,
      deviceId: newUnit.deviceId
    };

    setUnits(prev => prev.map(u => u.id === editingUnit.id ? updatedUnit : u));
    setNewUnit({ unitName: '', webhookUrl: '', deviceId: '', penId: '' });
    setShowAddUnit(false);
    setEditingUnit(null);
  };

  const handleDeleteUnit = (unitId: string) => {
    setUnits(prev => prev.filter(u => u.id !== unitId));
  };

  const handleToggleConnection = (unitId: string) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        const isConnecting = !unit.isConnected;
        return {
          ...unit,
          isConnected: isConnecting,
          lastUpdate: isConnecting ? new Date().toISOString() : undefined
        };
      }
      return unit;
    }));
  };

  const handleLinkToPen = (unitId: string, penId: string) => {
    const selectedPen = animals.find(a => a.id === penId);
    setUnits(prev => prev.map(unit => 
      unit.id === unitId 
        ? { ...unit, penId, penName: selectedPen?.penName }
        : unit
    ));
  };

  const handleUnlinkFromPen = (unitId: string) => {
    setUnits(prev => prev.map(unit => 
      unit.id === unitId 
        ? { ...unit, penId: undefined, penName: undefined }
        : unit
    ));
  };

  const availablePens = animals.filter(animal => 
    !units.some(unit => unit.penId === animal.id)
  );

  const connectedUnits = units.filter(u => u.isConnected).length;
  const totalUnits = units.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blynk Integration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage feeding units and their webhook connections to pens
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">{connectedUnits}</span> of {totalUnits} units connected
          </div>
          <button
            onClick={() => setShowAddUnit(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </button>
        </div>
      </div>

      {/* Add/Edit Unit Form */}
      {showAddUnit && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingUnit ? 'Edit Feeding Unit' : 'Add New Feeding Unit'}
            </h3>
            <button
              onClick={() => {
                setShowAddUnit(false);
                setEditingUnit(null);
                setNewUnit({ unitName: '', webhookUrl: '', deviceId: '', penId: '' });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Name *
              </label>
              <input
                type="text"
                value={newUnit.unitName}
                onChange={(e) => setNewUnit(prev => ({ ...prev, unitName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Feeding Unit 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Pen
              </label>
              <select
                value={newUnit.penId}
                onChange={(e) => setNewUnit(prev => ({ ...prev, penId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a pen (optional)</option>
                {editingUnit && editingUnit.penId && (
                  <option value={editingUnit.penId}>
                    {animals.find(a => a.id === editingUnit.penId)?.penName} (Current)
                  </option>
                )}
                {availablePens.map(pen => (
                  <option key={pen.id} value={pen.id}>{pen.penName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device ID *
              </label>
              <input
                type="text"
                value={newUnit.deviceId}
                onChange={(e) => setNewUnit(prev => ({ ...prev, deviceId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., blynk-feeder-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL *
              </label>
              <input
                type="url"
                value={newUnit.webhookUrl}
                onChange={(e) => setNewUnit(prev => ({ ...prev, webhookUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://your-app.com/webhook/unit1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAddUnit(false);
                setEditingUnit(null);
                setNewUnit({ unitName: '', webhookUrl: '', deviceId: '', penId: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingUnit ? handleUpdateUnit : handleAddUnit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              {editingUnit ? 'Update Unit' : 'Add Unit'}
            </button>
          </div>
        </div>
      )}

      {/* Units List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  unit.isConnected ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {unit.isConnected ? (
                    <Wifi className="h-5 w-5 text-green-600" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{unit.unitName}</h3>
                  <p className="text-sm text-gray-500">{unit.deviceId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditUnit(unit)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteUnit(unit.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pen Assignment */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Assigned Pen:</span>
                  <div className="text-sm text-gray-900">
                    {unit.penName ? (
                      <span className="font-medium">{unit.penName}</span>
                    ) : (
                      <span className="text-gray-500 italic">Not assigned</span>
                    )}
                  </div>
                </div>
                {unit.penId ? (
                  <button
                    onClick={() => handleUnlinkFromPen(unit.id)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                  >
                    <Unlink className="h-4 w-4 mr-1" />
                    Unlink
                  </button>
                ) : availablePens.length > 0 && (
                  <select
                    onChange={(e) => e.target.value && handleLinkToPen(unit.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Link to pen...</option>
                    {availablePens.map(pen => (
                      <option key={pen.id} value={pen.id}>{pen.penName}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Connection Status */}
            <div className="mb-4">
              <div className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                unit.isConnected 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {unit.isConnected ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                <span className="font-medium">
                  {unit.isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {unit.lastUpdate && (
                  <span className="ml-2 text-xs">
                    Last: {new Date(unit.lastUpdate).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Webhook URL */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Webhook URL</label>
              <div className="text-sm text-gray-900 bg-gray-100 p-2 rounded font-mono text-xs break-all">
                {unit.webhookUrl}
              </div>
            </div>

            {/* Connection Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleToggleConnection(unit.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  unit.isConnected
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                }`}
              >
                {unit.isConnected ? 'Disconnect' : 'Connect'}
              </button>
              
              {unit.recentData.length > 0 && (
                <div className="text-xs text-gray-500">
                  Last feed: {unit.recentData[unit.recentData.length - 1].feedAmount} kg
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {units.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Feeding Units Configured</h3>
          <p className="text-gray-500 mb-4">Add your first feeding unit to start receiving data from Blynk</p>
          <button
            onClick={() => setShowAddUnit(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Add First Unit
          </button>
        </div>
      )}

      {/* Configuration Guide */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Unit Configuration Guide</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create a separate Blynk project for each feeding unit</li>
                  <li>Configure each unit with its unique webhook URL</li>
                  <li>Assign each feeding unit to its corresponding pen</li>
                  <li>Ensure each unit sends data with its unique device ID</li>
                  <li>Test the connection for each unit individually</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Data Format</h4>
            <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
{`{
  "timestamp": "2025-01-15T10:30:00Z",
  "feedAmount": 125.5,
  "deviceId": "blynk-feeder-001",
  "unitId": "unit1",
  "penId": "pen-a-01",
  "feedType": "mixed-feed",
  "cost": 188.25
}`}
            </pre>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Each feeding unit must have a unique webhook URL</li>
                  <li>One feeding unit per pen for accurate tracking</li>
                  <li>Feed amounts should be total for the entire pen</li>
                  <li>Device IDs must be unique across all units</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};