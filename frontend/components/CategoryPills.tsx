import React from 'react';

const CATEGORIES = ['All', 'Book', 'Course', 'Project'];

interface CategoryPillsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-widest">
        Filter by
      </span>
      
      {CATEGORIES.map(category => {
        const isActive = selected.toLowerCase() === category.toLowerCase();
        
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border select-none
              ${isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-100' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 active:bg-gray-50'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
