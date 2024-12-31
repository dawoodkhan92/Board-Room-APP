import React from 'react';
import { ClipboardList } from 'lucide-react';

interface SummaryPanelProps {
  summary: string;
  actionItems: string[];
}

export function SummaryPanel({ summary, actionItems }: SummaryPanelProps) {
  return (
    <div className="border-l border-gray-200 bg-gray-50 p-6 w-96">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ClipboardList size={20} />
          Discussion Summary
        </h3>
        <p className="text-gray-600">{summary}</p>
      </div>
      <div>
        <h4 className="font-medium mb-3">Action Items</h4>
        <ul className="space-y-2">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="inline-block w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0 text-sm flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}