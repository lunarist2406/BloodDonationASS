import { useState, useCallback, useEffect } from "react";

export type SearchByCentralDistanceDTO = {
    central_id: string;
    radiusInKm: number;
  };

export type SearchByCurrentPosDTO = {
    lat: number;
    lng: number;
    radiusInKm: number;
  };

export type SearchByDistanceDTO = {
    user_id: string;
    radiusInKm: number;
    typeToSearch?: string | undefined;
  };

export interface BloodDonationData {
  id: string;
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

interface FilterState {
  selectedTypes: string[];
  selectedCenter: string | null;
}

type UseBloodDonationFilterOptions = {
  distanceKm: number;
  selectedCenter: string | null
};

export const useBloodDonationFilter = (
  allData: BloodDonationData[],
  options: UseBloodDonationFilterOptions
) => {
  const [filterState, setFilterState] = useState<FilterState>({
    selectedTypes: [],
    distanceKm: options.distanceKm,
    selectedCenter: options.selectedCenter || null ,
  });
  const [filteredData, setFilteredData] = useState<BloodDonationData[]>(allData);
  const [error, setError] = useState<string | null>(null);

  const filterData = useCallback(() => {
    try {
      setError(null);
      const { selectedTypes, selectedCenter } = filterState;
      const distanceKm = options.distanceKm;

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
  }, [allData, filterState, options.distanceKm]);

  const updateTypes = useCallback((types: string[]) => {
    setFilterState((prev) => ({ ...prev, selectedTypes: types }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      selectedTypes: [],
      distanceKm: options.distanceKm,
      selectedCenter: null,
    });
    setError(null);
  }, [options.distanceKm]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  return {
    filteredData,
    selectedTypes: filterState.selectedTypes,
    error,
    updateTypes,
    clearFilters,
    filterData
  };
};
