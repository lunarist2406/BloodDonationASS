import { Checkbox, Divider, Select, Slider } from "antd";

interface FilterInformationUIProps {
  selectedTypes: string[];
  distanceKm: number;
  selectedCenter: string | null;
  onTypeChange: (types: string[]) => void;
  onDistanceChange: (distance: number) => void;
  onCenterChange: (center: string | null) => void;
}

export const FilterInformationUI = ({
  selectedTypes,
  distanceKm,
  selectedCenter,
  onTypeChange,
  onDistanceChange,
  onCenterChange,
}: FilterInformationUIProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto h-[100%]">
      <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
        Bộ lọc thông tin
      </h2>
      <div className="text-2xs font-semibold text-red-600">
        <h4>Vai Trò</h4>
        <Checkbox.Group
          value={selectedTypes}
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          onChange={onTypeChange}
        >
          <Checkbox value="hien">Hiến máu</Checkbox>
          <Checkbox value="can">Nhận Máu</Checkbox>
          <Checkbox value="lichsu">Đã hiến và cần máu</Checkbox>
        </Checkbox.Group>
      </div>
      <div className="text-2xs font-semibold text-red-600">
        <h4>Trung Tâm</h4>
        <Select
          value={selectedCenter}
          style={{ width: '100%', marginBottom: "1rem" }}
          onChange={onCenterChange}
          allowClear
          placeholder="Chọn trung tâm"
        >
          <Select.Option value="center1">Trung tâm 1</Select.Option>
          <Select.Option value="center2">Trung tâm 2</Select.Option>
        </Select>
      </div>
      <div className="font-semibold text-red-600 mb-4">
        <h4>Khoảng cách (tối đa): {distanceKm} km</h4>
        <Slider
          min={1}
          max={20}
          step={1}
          value={distanceKm}
          onChange={onDistanceChange}
        />
      </div>
      <Divider />
    </div>
  );
};