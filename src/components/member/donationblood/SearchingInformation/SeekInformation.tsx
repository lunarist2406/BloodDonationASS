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

export const SeekInformation = () => {
  const { data, loading, error, getData, setData } = useBloodDonationData();
  const [originalData, setOriginalData] = useState<BloodDonationData[]>([]);
  const { user } = useAuth();
  const [distanceKm, setDistanceKm] = useState(10);
  const [selectedCenter, updateCenter] = useState<string>("");

  const { filteredData, selectedTypes, updateTypes } = useBloodDonationFilter(
    data,
    { distanceKm, selectedCenter }
  );
  useEffect(() => {
    if (user) {
      const searchByDistance: SearchByDistanceDTO = {
        user_id: user.user_id,
        radiusInKm: distanceKm,
        typeToSearch: "",
      };
      getData(searchByDistance);
      setOriginalData(data);
    }
  }, [user, distanceKm, getData]);

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
