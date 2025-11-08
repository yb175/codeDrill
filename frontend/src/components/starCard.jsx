import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bot,
  FilePlus,
  Search,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';

// --- Reusable Components ---

/**
 * StatCard Component
 * A reusable rectangular card to display key metrics.
 */
const StatCard = ({ title, value, icon, bgColorClass }) => {
  const IconComponent = icon || LayoutDashboard; // Default icon
  return (
    <div className={`flex-1 p-6 ${bgColorClass} rounded-lg shadow-sm border border-neutral-700`}>
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-neutral-900 rounded-md">
          <IconComponent className="w-5 h-5 text-neutral-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-400">{title}</p>
          <p className="text-2xl font-semibold text-neutral-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;