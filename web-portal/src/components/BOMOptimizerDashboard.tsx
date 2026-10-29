'use client';

import React, { useState } from 'react';

interface BOMItem {
  mpn: string;
  quantity: number;
}

interface OptimizedResult {
  mpn: string;
  requestedQty: number;
  lifecycle?: string;
  manufacturer?: string;
  sellers?: Array<{
    company: { name: string };
    offers: Array<{
      inventoryLevel: number;
      prices: Array<{ price: number; currency: string }>;
    }>;
  }>;
}

export default function BOMOptimizerDashboard() {
  const [mpnInput, setMpnInput] = useState('');
  const [qtyInput, setQtyInput] = useState(100);
  const [items, setItems] = useState<BOMItem[]>([
    { mpn: 'ESP32-S3-WROOM-1', quantity: 500 },
    { mpn: 'SX1262IMLTRT', quantity: 500 }
  ]);
  const [results, setResults] = useState<OptimizedResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (!mpnInput) return;
    setItems([...items, { mpn: mpnInput, quantity: qtyInput }]);
    setMpnInput('');
  };

  const handleOptimizeBOM = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/bom/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await response.json();
      setResults(data.optimized_items || []);
    } catch (err) {
      console.error('Failed to optimize BOM', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-900 text-slate-100 min-h-screen rounded-xl shadow-2xl border border-slate-800 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CircuitFlow Workspace</h1>
          <p className="text-sm text-slate-400">Autonomous Hardware Supply Chain & BOM Optimizer</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
          GCP Cloud Connected
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Add Component</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Manufacturer Part Number (MPN)</label>
              <input 
                type="text" 
                value={mpnInput} 
                onChange={(e) => setMpnInput(e.target.value)}
                placeholder="e.g. BME280"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Batch Quantity</label>
              <input 
                type="number" 
                value={qtyInput} 
                onChange={(e) => setQtyInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button 
              onClick={addItem}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded text-sm transition"
            >
              Add Component
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Active Specification ({items.length} items)</h2>
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded border border-slate-800 text-sm">
                  <span className="font-mono text-indigo-400">{item.mpn}</span>
                  <span className="text-slate-400">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={handleOptimizeBOM}
            disabled={loading || items.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded text-sm transition shadow-lg"
          >
            {loading ? 'Executing Live Supply Chain Sync...' : 'Run Real-Time BOM Optimization'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Optimization & Lifecycle Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-mono">
                <tr>
                  <th className="p-3">MPN</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Lifecycle Status</th>
                  <th className="p-3">Top Distributor Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {results.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-900/50">
                    <td className="p-3 text-indigo-300 font-bold">{res.mpn}</td>
                    <td className="p-3">{res.manufacturer || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        res.lifecycle === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {res.lifecycle || 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {res.sellers && res.sellers.length > 0 
                        ? `${res.sellers[0].company.name} (${res.sellers[0].offers[0]?.inventoryLevel || 0} units)` 
                        : 'Available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
