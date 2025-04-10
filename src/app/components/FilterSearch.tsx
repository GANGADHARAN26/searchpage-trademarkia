// src/app/components/FilterSearch.tsx
import React, { useState } from 'react';

interface FilterSearchProps {
  owners: string[];
  lawFirms: string[];
  attorneys: string[];
  selectedOwners: string[];
  setSelectedOwners: (owners: string[]) => void;
  selectedLawFirms: string[];
  setSelectedLawFirms: (firms: string[]) => void;
  selectedAttorneys: string[];
  setSelectedAttorneys: (attorneys: string[]) => void;
}

const FilterSearch: React.FC<FilterSearchProps> = ({
  owners,
  lawFirms,
  attorneys,
  selectedOwners,
  setSelectedOwners,
  selectedLawFirms,
  setSelectedLawFirms,
  selectedAttorneys,
  setSelectedAttorneys,
}) => {
  const [activeTab, setActiveTab] = useState<'Owners' | 'Law Firms' | 'Attorneys'>('Owners');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabClick = (tab: 'Owners' | 'Law Firms' | 'Attorneys') => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (item: string, type: 'owner' | 'lawFirm' | 'attorney') => {
    switch (type) {
      case 'owner':
        setSelectedOwners(
          selectedOwners?.includes(item)
            ? selectedOwners.filter(owner => owner !== item)
            : [...(selectedOwners || []), item]
        );
        break;
      case 'lawFirm':
        setSelectedLawFirms(
          selectedLawFirms?.includes(item)
            ? selectedLawFirms.filter(firm => firm !== item)
            : [...(selectedLawFirms || []), item]
        );
        break;
      case 'attorney':
        setSelectedAttorneys(
          selectedAttorneys?.includes(item)
            ? selectedAttorneys.filter(attorney => attorney !== item)
            : [...(selectedAttorneys || []), item]
        );
        break;
    }
  };

  const getFilteredItems = () => {
    const items = activeTab === 'Owners' ? owners :
                 activeTab === 'Law Firms' ? lawFirms :
                 attorneys;

    return items?.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  };

  const getSelectedItems = () => {
    return activeTab === 'Owners' ? (selectedOwners || []) :
           activeTab === 'Law Firms' ? (selectedLawFirms || []) :
           (selectedAttorneys || []);
  };

  return (
    <div className="border-1 p-4 rounded-xl border-gray-300">
      <div className="flex gap-4 mb-4">
        {(['Owners', 'Law Firms', 'Attorneys'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="max-h-60 overflow-y-auto">
        {getFilteredItems().map((item) => (
          <div key={item} className="flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={getSelectedItems().includes(item)}
              onChange={() => handleCheckboxChange(
                item,
                activeTab === 'Owners' ? 'owner' :
                activeTab === 'Law Firms' ? 'lawFirm' :
                'attorney'
              )}
              className="w-4 h-4"
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSearch;
