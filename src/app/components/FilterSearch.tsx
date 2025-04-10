// src/app/components/FilterSearch.tsx
import { useState } from 'react';

type FilterSearchProps = {
  owners: string[];
  lawFirms: string[];
  attorneys: string[];
};

const FilterSearch = ({ owners, lawFirms, attorneys }: FilterSearchProps) => {
  const [activeTab, setActiveTab] = useState<'Owners' | 'Law Firms' | 'Attorneys'>('Owners');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedLawFirms, setSelectedLawFirms] = useState<string[]>([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState<string[]>([]);

  const handleTabClick = (tab: 'Owners' | 'Law Firms' | 'Attorneys') => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (
    item: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const filteredOwners = owners.filter((owner) =>
    owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLawFirms = lawFirms.filter((lawFirm) =>
    lawFirm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttorneys = attorneys.filter((attorney) =>
    attorney.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{ border: '1px solid #ccc', padding: '10px' }}
      className="rounded-2xl border-gray-300 bg-white shadow-xl"
    >
      <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
        {(['Owners', 'Law Firms', 'Attorneys'] as const).map((tab) => (
          <button
            key={tab}
            style={{
              padding: '10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              borderBottom: activeTab === tab ? '2px solid black' : 'none',
            }}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px', marginRight: '5px', color: '#777' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${activeTab}`}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ border: 'none', outline: 'none', flexGrow: 1 }}
          />
        </div>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {activeTab === 'Owners' &&
          filteredOwners.map((owner, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
              <input
                type="checkbox"
                checked={selectedOwners.includes(owner)}
                onChange={() =>
                  handleCheckboxChange(owner, selectedOwners, setSelectedOwners)
                }
                style={{ marginRight: '10px' }}
              />
              <span>{owner}</span>
            </div>
          ))}

        {activeTab === 'Law Firms' &&
          filteredLawFirms.map((lawFirm, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
              <input
                type="checkbox"
                checked={selectedLawFirms.includes(lawFirm)}
                onChange={() =>
                  handleCheckboxChange(lawFirm, selectedLawFirms, setSelectedLawFirms)
                }
                style={{ marginRight: '10px' }}
              />
              <span>{lawFirm}</span>
            </div>
          ))}

        {activeTab === 'Attorneys' &&
          filteredAttorneys.map((attorney, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
              <input
                type="checkbox"
                checked={selectedAttorneys.includes(attorney)}
                onChange={() =>
                  handleCheckboxChange(attorney, selectedAttorneys, setSelectedAttorneys)
                }
                style={{ marginRight: '10px' }}
              />
              <span>{attorney}</span>
            </div>
          ))}

        {activeTab === 'Owners' && filteredOwners.length === 0 && searchTerm !== '' && (
          <div style={{ padding: '10px', color: '#777' }}>No owners found.</div>
        )}
        {activeTab === 'Law Firms' && filteredLawFirms.length === 0 && searchTerm !== '' && (
          <div style={{ padding: '10px', color: '#777' }}>No law firms found.</div>
        )}
        {activeTab === 'Attorneys' && filteredAttorneys.length === 0 && searchTerm !== '' && (
          <div style={{ padding: '10px', color: '#777' }}>No attorneys found.</div>
        )}
      </div>
    </div>
  );
};

export default FilterSearch;
