import { IconBuildingBank, IconMapPin, IconClock } from "@tabler/icons-react";

export default function GoogleMapCentral({ central }: { central: any }) {
  if (!central) {
    return (
      <p className="text-gray-500 italic">Chọn một trung tâm để xem bản đồ</p>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    central.centralBlood_address
  )}&output=embed`;

  return (
    <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-red-100 via-red-200 to-red-300">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-700">
        🗺️ Bản Đồ Trung Tâm
      </h2>

      <div className="mb-3 space-y-2">
        <p className="flex items-center gap-2 font-bold text-red-700 text-base">
          <IconBuildingBank size={20} />
          {central.centralBlood_name}
        </p>
        <p className="flex items-center gap-2 text-gray-700 text-sm">
          <IconMapPin size={18} />
          {central.centralBlood_address}
        </p>

        <div className="flex items-start gap-2 text-gray-700 text-sm">
          <IconClock size={18} className="mt-1" />
          <div className="space-y-1">
            {central.working_id && central.working_id.length > 0 ? (
              central.working_id.map((item: any) => (
                <div key={item.working_id}>
                  <span className="font-medium">{item.day_of_week}</span>:{" "}
                  {item.open_time?.slice(11, 16)} -{" "}
                  {item.close_time?.slice(11, 16)} (
                  {item.is_open ? "Mở" : "Đóng"})
                </div>
              ))
            ) : (
              <span className="italic text-gray-400">
                Không có giờ làm việc
              </span>
            )}
          </div>
        </div>
      </div>

      <iframe
        title="Google Map"
        src={mapUrl}
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "8px" }}
        loading="lazy"
      ></iframe>
    </div>
  );
}
