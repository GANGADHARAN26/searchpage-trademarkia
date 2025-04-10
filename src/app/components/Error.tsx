// app/dashboard/error.tsx
'use client';

import React from 'react';

interface ErrorProps {
  error: Error | string;
  reset?: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{errorMessage}</span>
      {reset && (
        <button
          onClick={reset}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Retry</span>
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Retry</title>
            <path d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Error;
