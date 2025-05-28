import FilterInformation from "./FilterInformation";

export default function SeekInformation() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <div className="grid grid-cols-20 gap-3 px-10 mt-10 mb-10">
        <div className="col-span-6">
          <FilterInformation />
        </div>
        <div className="col-span-14">
          <h2>View</h2>
        </div>
      </div>
    </div>
  );
}
