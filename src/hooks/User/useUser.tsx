import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import useUserService from "./useUserService";

export interface RoleUser {
  role_id: string;
  role_name: string;
}

export interface LocationUser {
  ipAddress: string;
  country: string;
  district: string;
  road: string;
  location_id: string;
}

export interface data {
  user_id: string;
  fullname: string;
  role_id: RoleUser[];
  gender: string;
  location_id: LocationUser[];
  token: string;
}
export interface UserInformation{
    data : data
}
export default function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserInformation | null>(null); // 👈 dùng object thay vì array
  const { getUserById } = useUserService();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.user_id) return;
      try {
        const res = (await getUserById(user.user_id)) as UserInformation;
        console.log("Res:", res);
        setUserData(res);
        console.log("Tên người dùng:", res.data.fullname);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // ✅ Đây mới là cái cần trả ra từ hook
  return {
    userData,
    setUserData,
  };
}
