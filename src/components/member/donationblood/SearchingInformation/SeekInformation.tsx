import { useEffect, useState } from "react";
import { useBloodDonationData } from "../../../../hooks/SearchByDistance/useBloodDonationData";
import {
  useBloodDonationFilter,
  type BloodDonationData,
  type SearchByDistanceDTO,
} from "../../../../hooks/SearchByDistance/useBloodDonationFilter";
import { FormViewFilter } from "./FormViewFilter";
import { FilterInformationUI } from "./FilterInformation";
import { useAuth } from "../../../../hooks/User/useAuth";
import useBloodDonationService from "../../../../hooks/SearchByDistance/useBloodDonationService";

export const SeekInformation = () => {
  const { data, loading, error, getData, setData } = useBloodDonationData();
  const [originalData, setOriginalData] = useState<BloodDonationData[]>([]);
  const { user } = useAuth();
  const [distanceKm, setDistanceKm] = useState(10);
  const [selectedCenter, updateCenter] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"default" | "location" | "central">("default");
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { searchByCurrentPosition, searchByCentralDistance } = useBloodDonationService();

  const { filteredData, selectedTypes, updateTypes } = useBloodDonationFilter(
    data,
    { distanceKm, selectedCenter }
  );

  useEffect(() => {
  const fetchDataByMode = async () => {
    if (!user) return;

    try {
      if (filterMode === "location" && currentCoords) {
        const res = await searchByCurrentPosition({
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          radiusInKm: distanceKm,
        });
        setData(res.data);
        setOriginalData(res.data);
      } else if (filterMode === "central" && selectedCenter) {
        const res = await searchByCentralDistance({
          central_id: selectedCenter,
          radiusInKm: distanceKm,
        });
        setData(res.data);
        setOriginalData(res.data);
      } else {
        // ✅ FIX: khi đang ở default (không central, không location), vẫn cần fetch theo distance
        const searchByDistance: SearchByDistanceDTO = {
          user_id: user.user_id,
          radiusInKm: distanceKm,
          typeToSearch: "",
        };
        const res = await getData(searchByDistance);
        setOriginalData(res.data);
        setData(res.data); // cần cập nhật cả setData
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật dữ liệu theo khoảng cách", err);
    }
  };

  fetchDataByMode();
}, [distanceKm, filterMode, currentCoords, selectedCenter]);


  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <div className="grid grid-cols-20 gap-3 px-10 mt-10 mb-10 min-h-[440px]">
        <div className="col-span-6">
          <FilterInformationUI
            selectedTypes={selectedTypes}
            distanceKm={distanceKm}
            selectedCenter={selectedCenter}
            onTypeChange={updateTypes}
            onDistanceChange={setDistanceKm}
            onCenterChange={updateCenter}
            setData={setData}
            originalData={originalData}
            setOriginalData={setOriginalData}
            onFilterModeChange={setFilterMode}
            onUseCurrentLocationChange={setCurrentCoords}
          />
        </div>
        <div className="col-span-14">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-solid"></div>
            </div>
          ) : (
            <FormViewFilter data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};
