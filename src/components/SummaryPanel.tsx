import React from 'react';
import { ClipboardList } from 'lucide-react';

interface SummaryPanelProps {
  summary: string;
  actionItems: string[];
}

export function SummaryPanel({ summary, actionItems }: SummaryPanelProps) {
  return (
    <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Meeting Summary</h2>
        <p className="text-sm text-gray-600">{summary}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ClipboardList size={20} />
          Action Items
        </h2>
        <ul className="space-y-2">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-indigo-600 mt-1">•</span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}