import { useEffect } from "react";
import { useBloodDonationData } from "../../../../hooks/useBloodDonationData";
import { useBloodDonationFilter } from "../../../../hooks/useBloodDonationFilter";
import { FormViewFilter } from "./FormViewFilter";
import { FilterInformationUI } from "./FilterInformation";

export const SeekInformation = () => {
  const { data, loading, error, getData } = useBloodDonationData();
  const {
    filteredData,
    selectedTypes,
    selectedCenter,
    distanceKm,
    updateTypes,
    updateCenter,
    updateDistance,
  } = useBloodDonationFilter(data);

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <div className="grid grid-cols-20 gap-3 px-10 mt-10 mb-10">
        <div className="col-span-6">
          <FilterInformationUI
            selectedTypes={selectedTypes}
            distanceKm={distanceKm}
            selectedCenter={selectedCenter}
            onTypeChange={updateTypes}
            onDistanceChange={updateDistance}
            onCenterChange={updateCenter}
          />
        </div>
        <div className="col-span-14">
          <FormViewFilter data={filteredData} />
        </div>
      </div>
    </div>
  );
};