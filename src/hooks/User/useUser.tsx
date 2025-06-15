import { useCallback, useEffect, useState } from "react";
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
  location_id: string | null;
}

export interface data {
  user_id: string;
  fullname: string;
  role_id: RoleUser[];
  gender: string;
  location_id: LocationUser;
  token: string;
  email: string;
  phone: string;
  dob: string;
}
export interface UserInformation {
  data: data;
}
// Hook để lấy thông tin người dùng

export interface Position {
  type: string;
  coordinates: [number, number];
}

export interface Location {
  ipAddress: string;
  district: string;
  road: string;
  location_id: string;
  city?: string;
  full_address?: string;
  house_number?: string;
  ward?: string;
  position?: Position;
}

export interface User {
  user_id: string;
  fullname: string;
  email: string;
  phone: string;
  dob: string | null; // ISO 8601 date string
  gender: string;
  role_id: RoleUser;
  location_id: Location;
}

export interface Meta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  data: {
    meta: Meta;
    result: User[];
  };
}

export default function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserInformation | null>(null); // 👈 dùng object thay vì array
  const [allUsers, setAllUsers] = useState<GetAllUsersResponse | null>(null); // 👈 list tất cả người dùng

  const { getUserById, getAllUsers } = useUserService();

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

  const fetchAllUsers = useCallback(async (current = 1, pageSize = 10) => {
    try {
      const res = (await getAllUsers(current, pageSize)) as GetAllUsersResponse;
      setAllUsers(res);
      return res;
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      return null;
    }
  }, []);

  // ✅ Đây mới là cái cần trả ra từ hook
  return {
    userData,
    setUserData,
    allUsers,
    setAllUsers,
    fetchAllUsers,
  };
}
