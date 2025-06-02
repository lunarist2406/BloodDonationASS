// SeekInformation.jsx
import { useState } from "react";
import FilterInformation from "./FilterInformation";
import FormViewFilter from "./FormViewFilter";

const allData = [
  { id: 1, type: "hien", name: "Nguyễn Văn A - Đăng ký hiến máu", distance: 3 },
  { id: 2, type: "can", name: "Trần Thị B - Cần máu khẩn cấp", distance: 8 },
  { id: 3, type: "lichsu", name: "Lê Văn C - Đã hiến và cần máu", distance: 12 },
  { id: 4, type: "hien", name: "Phạm Thị D - Đăng ký hiến máu", distance: 5 },
];

export default function SeekInformation() {
  const [filteredData, setFilteredData] = useState(allData);
  const [distanceKm, setDistanceKm] = useState(10); // default 10km

  const handleFilter = (selectedTypes) => {
  const result = allData.filter((item) => {
    const matchType =
      selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchDistance = item.distance <= distanceKm;
    return matchType && matchDistance;
  });
  setFilteredData(result);
    
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen h-[800px]">
      <div className="grid grid-cols-20 gap-3 px-10 mt-10 mb-10">
        <div className="col-span-6">
          <FilterInformation onFilter={handleFilter} />
        </div>
        <div className="col-span-14">
          <FormViewFilter data={filteredData} />
        </div>
      </div>
    </div>
  );
}
