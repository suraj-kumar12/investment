import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <DataContext.Provider value={{ refreshTrigger, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
