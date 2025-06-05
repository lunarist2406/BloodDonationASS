// FilterInformation.jsx
import { useState, useEffect } from "react";
import { Checkbox, Divider, Select, Slider } from "antd";

export default function FilterInformation({ onFilter }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
const [distanceKm, setDistanceKm] = useState(10); // thêm dòng này

  const handleChange = (checkedValues) => {
    setSelectedTypes(checkedValues);
  };
  const handleSliderChange = (value) => {
    setDistanceKm(value);
  };



  useEffect(() => {
    // Gọi callback khi selectedTypes thay đổi
    onFilter(selectedTypes, distanceKm);
  }, [selectedTypes,distanceKm, onFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto h-[100%]">
      <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
        Bộ lọc thông tin
      </h2>
      <div className="text-2xs font-semibold text-red-600">
        <h4>Vai Trò</h4>
        <Checkbox.Group
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          onChange={handleChange}
        >
          <Checkbox value="hien">Hiến máu</Checkbox>
          <Checkbox value="can">Nhận Máu</Checkbox>
        </Checkbox.Group>
      </div>
      <div className="text-2xs font-semibold text-red-600 ">
        <h4>Trung Tâm </h4>
        <Select
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          onChange={handleChange}
        >
          <Checkbox value="hien">Hiến máu</Checkbox>
          <Checkbox value="can">Nhận Máu</Checkbox>
        </Select>
      </div>
      <div className="font-semibold text-red-600 mb-4">
        <h4>Khoảng cách (tối đa): {distanceKm} km</h4>
        <Slider
          min={1}
          max={20}
          step={1}
          value={distanceKm}
          onChange={handleSliderChange}
        />
      </div>

      <Divider />
    </div>
  );
}
