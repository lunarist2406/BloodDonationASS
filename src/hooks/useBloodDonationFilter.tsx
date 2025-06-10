import { useState, useCallback, useEffect } from "react";

export interface BloodDonationData {
  id: number;
  type: string;
  name: string;
  distance: number;
  center?: string;
}

interface FilterState {
  selectedTypes: string[];
  distanceKm: number;
  selectedCenter: string | null;
}

export const useBloodDonationFilter = (allData: BloodDonationData[]) => {
  const [filterState, setFilterState] = useState<FilterState>({
    selectedTypes: [],
    distanceKm: 10,
    selectedCenter: null,
  });
  const [filteredData, setFilteredData] = useState<BloodDonationData[]>(allData);
  const [error, setError] = useState<string | null>(null);

  const filterData = useCallback(() => {
    try {
      setError(null);
      const { selectedTypes, distanceKm, selectedCenter } = filterState;

      const result = allData.filter((item) => {
        const matchType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
        const matchDistance = item.distance <= distanceKm;
        const matchCenter = !selectedCenter || item.center === selectedCenter;
        
        return matchType && matchDistance && matchCenter;
      });

      setFilteredData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Lỗi khi lọc dữ liệu: ${errorMessage}`);
      setFilteredData([]);
      return [];
    }
  }, [allData, filterState]);

  const updateTypes = useCallback((types: string[]) => {
    try {
      setFilterState(prev => ({ ...prev, selectedTypes: types }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Lỗi khi cập nhật loại vai trò: ${errorMessage}`);
    }
  }, []);

  const updateDistance = useCallback((distance: number) => {
    try {
      if (distance < 0) {
        throw new Error("Khoảng cách phải là số dương");
      }
      setFilterState(prev => ({ ...prev, distanceKm: distance }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Lỗi khi cập nhật khoảng cách: ${errorMessage}`);
    }
  }, []);

  const updateCenter = useCallback((center: string | null) => {
    setFilterState(prev => ({ ...prev, selectedCenter: center }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      selectedTypes: [],
      distanceKm: 10,
      selectedCenter: null,
    });
    setError(null);
  }, []);

  useEffect(() => {
    filterData();
  }, [filterData]);

  return {
    filteredData,
    selectedTypes: filterState.selectedTypes,
    distanceKm: filterState.distanceKm,
    selectedCenter: filterState.selectedCenter,
    error,
    updateTypes,
    updateDistance,
    updateCenter,
    clearFilters,
    filterData
  };
};