// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div
      className="w-16 h-16 border-4 border-solid border-blue-500 border-t-transparent rounded-full animate-spin"
      role="status"
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  </div>
);

export default LoadingSpinner;
