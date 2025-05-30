import React from "react";
import { useRegisterBlood } from "../../../../hooks/useRegisterBlood";
import FormViewDonate from "./FormViewReceiver";
import FilterDonateBlood from "./TableReceiver";
import TableDonateBlood from "./TableReceiver";

export default function ReceiverBlood() {
  const { waitingList, formData, setFormData } = useRegisterBlood();

  return (
    <div className="flex flex-col bg-gradient-to-b from-red-100 to-red-300 min-h-screen">
      <div className="grid grid-cols-20 gap-4 px-5 mt-5 mb-10">
        {/* Truyền formData để hiển thị */}
        <div className="col-span-6">
          <TableDonateBlood data={waitingList} />
        </div>
        <div className="col-span-14">
          <FormViewDonate formData={waitingList} />
        </div>
      </div>
    </div>
  );
}
