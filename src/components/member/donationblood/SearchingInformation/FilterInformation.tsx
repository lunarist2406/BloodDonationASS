import { Checkbox, Divider, message, Select, Slider } from "antd";
import useCentral from "../../../../hooks/CentralBlood/useCentral";
import { useState } from "react";
import useBloodDonationService from "../../../../hooks/SearchByDistance/useBloodDonationService";
import type {
  BloodDonationData,
  SearchByCurrentPosDTO,
} from "../../../../hooks/SearchByDistance/useBloodDonationFilter";

interface FilterInformationUIProps {
  selectedTypes: string[];
  distanceKm: number;
  selectedCenter: string | null;
  onTypeChange: (types: string[]) => void;
  onDistanceChange: (distance: number) => void;
  onCenterChange: (center: string | null) => void;
  onUseCurrentLocationChange?: (
    coords: { lat: number; lng: number } | null
  ) => void;
  setData: (data: BloodDonationData[]) => void;
  originalData: BloodDonationData[];
}

export const FilterInformationUI = ({
  selectedTypes,
  distanceKm,
  selectedCenter,
  onTypeChange,
  onDistanceChange,
  onCenterChange,
  onUseCurrentLocationChange,
  setData,
  originalData,
}: FilterInformationUIProps) => {
  const { central } = useCentral();
  const { searchByCurrentPosition, searchByCentralDistance } =
    useBloodDonationService();
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleCenterChange = async (center: string | null) => {
    onCenterChange(center);

    if (!center) {
      setData(originalData);
      return;
    }

    setUseCurrentLocation(false);
    onUseCurrentLocationChange?.(null);

    try {
      const response = await searchByCentralDistance({
        central_id: center,
        radiusInKm: distanceKm,
      });

      setData(response.data);
    } catch (err) {
      message.error("Không thể tìm theo trung tâm. Vui lòng thử lại.");
    }
  };

  const handleAllowClear = () => {
    onCenterChange(null);
    setUseCurrentLocation(false);
    onUseCurrentLocationChange?.(null);
    setData(originalData);
  };

  const handleUseLocationChange = async (checked: boolean) => {
    if (!checked) {
      setUseCurrentLocation(false);
      onUseCurrentLocationChange?.(null);
      setData(originalData);
      return;
    }

    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ định vị.");
      setUseCurrentLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUseCurrentLocation(true);
        onUseCurrentLocationChange?.({ lat: latitude, lng: longitude });
        console.log("lat", latitude);
        console.log("lng", longitude);
        const objectSearch: SearchByCurrentPosDTO = {
          lat: latitude,
          lng: longitude,
          radiusInKm: distanceKm || 10,
        };
        const response = await searchByCurrentPosition(objectSearch);
        console.log(response.data);
        setData(response.data);
      },
      (error) => {
        setUseCurrentLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          message.error("Bạn đã từ chối truy cập vị trí.");
        } else {
          message.error("Không thể lấy vị trí. Vui lòng thử lại.");
        }
        onUseCurrentLocationChange?.(null);
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto h-[100%]">
      <h2 className="text-xl font-semibold text-center text-red-600 mb-4">
        Bộ lọc thông tin
      </h2>
      <div className="text-xs font-semibold text-red-600 mb-2">
        <Checkbox
          checked={useCurrentLocation}
          onChange={(e) => handleUseLocationChange(e.target.checked)}
          disabled={!!selectedCenter}
        >
          Sử dụng vị trí hiện tại để tìm kiếm
        </Checkbox>
      </div>
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
          style={{ width: "100%", marginBottom: "1rem" }}
          onChange={handleCenterChange}
          allowClear
          onClear={handleAllowClear}
          placeholder="Chọn trung tâm"
        >
          {central.map((c) => (
            <Select.Option
              key={c.centralBlood_id}
              value={c.centralBlood_id.toString()}
            >
              {c.centralBlood_name}
            </Select.Option>
          ))}
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
      <div className="text-sm text-center text-gray-600 italic mt-2">
        {useCurrentLocation
          ? "Đang tìm kiếm dựa trên địa chỉ hiện tại"
          : selectedCenter
          ? "Đang tìm kiếm dựa trên vị trí trung tâm"
          : "Đang tìm kiếm dựa trên địa chỉ đã đăng ký"}
      </div>
    </div>
  );
};
