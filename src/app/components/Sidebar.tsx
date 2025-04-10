import React from 'react';
import FilterSearch from './FilterSearch';
import { X } from 'lucide-react'; // Assuming you're using lucide for X icon

const Sidebar = ({
  sidebar,
  setSidebar,
  statuses,
  selectedStatus,
  setSelectedStatus,
  owners,
  lawFirms,
  attorneys,
  grid,
  setGrid,
}) => {
  return (
    <div
      className={`w-[90vw] md:w-[25vw] xl:w-[23vw] border-1 ${
        !sidebar && "ml-5 mt-5"
      } rounded-xl border-gray-300 ${
        sidebar && " bg-white w-[100vw]"
      }`}
    >
      {sidebar && (
        <div className="flex justify-end pt-3 pr-3">
          <X onClick={() => setSidebar(false)} />
        </div>
      )}

      {/* Status Filter */}
      <div className="border-1 m-5 p-5 border-gray-300 rounded-2xl shadow-2xl font-bold text-xl">
        <p>Status</p>
        <div className="flex flex-row flex-wrap gap-3">
          {statuses.map((status) => (
            <button
              key={status.label}
              onClick={() => setSelectedStatus(status.label)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-sm border-gray-300 ${
                selectedStatus === status.label
                  ? "bg-gray-300"
                  : "bg-white"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${status.color}`}
              ></span>
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Search */}
      <div className="m-5 rounded-2xl">
        <FilterSearch
          owners={owners.map((item) => item.key)}
          lawFirms={lawFirms.map((item) => item.key)}
          attorneys={attorneys.map((item) => item.key)}
        />
      </div>

      {/* Display Type */}
      <div className="border-1 m-5 p-5 border-gray-300 rounded-2xl shadow-2xl font-bold text-xl">
        <p className="pb-3">Display</p>
        <div className="flex justify-between rounded-xl p-5 bg-gray-300">
          <button
            className={`flex justify-center px-7 ${
              grid && "bg-white"
            } p-3 rounded-xl`}
            onClick={() => setGrid(true)}
          >
            Grid View
          </button>
          <button
            className={`flex justify-center px-7 ${
              !grid && "bg-white"
            } p-3 rounded-xl`}
            onClick={() => setGrid(false)}
          >
            List View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
