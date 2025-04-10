import { useState } from 'react';

const FilterSearch = ({ owners, lawFirms, attorneys }) => {
  const [activeTab, setActiveTab] = useState('Owners');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedLawFirms, setSelectedLawFirms] = useState([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOwnerCheckboxChange = (owner) => {
    if (selectedOwners.includes(owner)) {
      setSelectedOwners(selectedOwners.filter((o) => o !== owner));
    } else {
      setSelectedOwners([...selectedOwners, owner]);
    }
  };

  const handleLawFirmCheckboxChange = (lawFirm) => {
    if (selectedLawFirms.includes(lawFirm)) {
      setSelectedLawFirms(selectedLawFirms.filter((lf) => lf !== lawFirm));
    } else {
      setSelectedLawFirms([...selectedLawFirms, lawFirm]);
    }
  };

  const handleAttorneyCheckboxChange = (attorney) => {
    if (selectedAttorneys.includes(attorney)) {
      setSelectedAttorneys(selectedAttorneys.filter((a) => a !== attorney));
    } else {
      setSelectedAttorneys([...selectedAttorneys, attorney]);
    }
  };

  const filteredOwners = owners.filter((owner) =>
    String(owner).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLawFirms = lawFirms.filter((lawFirm) =>
    String(lawFirm).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttorneys = attorneys.filter((attorney) =>
    String(attorney).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', }} className='rounded-2xl border-gray-300 bg-white shadow-xl'>
      <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
        <button
          style={{
            padding: '10px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'Owners' ? 'bold' : 'normal',
            borderBottom: activeTab === 'Owners' ? '2px solid black' : 'none',
          }}
          onClick={() => handleTabClick('Owners')}
        >
          Owners
        </button>
        <button
          style={{
            padding: '10px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'Law Firms' ? 'bold' : 'normal',
            borderBottom: activeTab === 'Law Firms' ? '2px solid black' : 'none',
          }}
          onClick={() => handleTabClick('Law Firms')}
        >
          Law Firms
        </button>
        <button
          style={{
            padding: '10px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'Attorneys' ? 'bold' : 'normal',
            borderBottom: activeTab === 'Attorneys' ? '2px solid black' : 'none',
          }}
          onClick={() => handleTabClick('Attorneys')}
        >
          Attorneys
        </button>
      </div>

      <div style={{ padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '5px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', marginRight: '5px', color: '#777' }}>
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
                onChange={() => handleOwnerCheckboxChange(owner)}
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
                onChange={() => handleLawFirmCheckboxChange(lawFirm)}
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
                onChange={() => handleAttorneyCheckboxChange(attorney)}
                style={{ marginRight: '10px' }}
              />
              <span>{attorney}</span>
            </div>
          ))}

        {(activeTab === 'Owners' && filteredOwners.length === 0 && searchTerm !== '') && (
          <div style={{ padding: '10px', color: '#777' }}>No owners found.</div>
        )}
        {(activeTab === 'Law Firms' && filteredLawFirms.length === 0 && searchTerm !== '') && (
          <div style={{ padding: '10px', color: '#777' }}>No law firms found.</div>
        )}
        {(activeTab === 'Attorneys' && filteredAttorneys.length === 0 && searchTerm !== '') && (
          <div style={{ padding: '10px', color: '#777' }}>No attorneys found.</div>
        )}
      </div>
    </div>
  );
};

export default FilterSearch;
