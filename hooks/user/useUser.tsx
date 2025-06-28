import { useCallback, useEffect, useState } from "react";
import useUserService from "./useUserService";
import { useAuth } from "../auth/useAuthContext";

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
  dob: string | null;
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
  const { user, token } = useAuth(); // lấy token từ context
  const [userData, setUserData] = useState<UserInformation | null>(null);
  const [allUsers, setAllUsers] = useState<GetAllUsersResponse | null>(null);

  const { getUserById, getAllUsers } = useUserService();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.user_id || !token) return;

      try {
        const res = await getUserById(user.user_id);
        console.log("✅ Dữ liệu người dùng:", res);
        setUserData(res);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, [user?.user_id, token]);

  const fetchAllUsers = useCallback(async (current = 1, pageSize = 10) => {
    try {
      const res = await getAllUsers(current, pageSize);
      setAllUsers(res);
      return res;
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
      return null;
    }
  }, []);

  return {
    userData,
    setUserData,
    allUsers,
    setAllUsers,
    fetchAllUsers,
  };
}
