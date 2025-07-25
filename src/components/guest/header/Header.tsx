import  { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import {
  IconChevronDown,
  IconDroplet,
  IconBook,
  IconSearch,
  IconLogout,
  IconSettings2,
  IconDatabase,
  IconBuildingBank,
  IconUserCog,
  IconShieldCheck,
  IconUserBolt,
  IconUserCancel,
} from "@tabler/icons-react";
import img1 from "../../../assets/Blood-Donation-1.webp";
import { useAuth } from "../../../hooks/User/useAuth";
import NotificationDropdown from "../../notification/Notification";
import type { Notification } from "../../notification/types/notification";
import { io, type Socket } from "socket.io-client";

const DropdownLink = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) => (
  <Link
    to={to}
    className="block hover:scale-105 hover:text-red-500 transition-all duration-200"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default function GuestHeader() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fullname = user?.fullname?.trim() || "";
  const encodedName = fullname.replace(/\s+/g, "-").toLowerCase();

    const isMember = user?.role === "MEMBER";
    const isAdmin = user?.role === "ADMIN";
    const isStaff = user?.role === "STAFF";



  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const handleMarkAsRead = (id: string) => {
  setNotifications((prev) =>
    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  );
};

const handleMarkAllAsRead = () => {
  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
};
  useEffect(() => {
  document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
}, [showMobileMenu]);

  useEffect(() => {
    if (isAuthenticated() && isMember) {
      // Kết nối socket khi là MEMBER
      socketRef.current = io("https://blooddonation-be-production.up.railway.app/notification", {
        transports: ["websocket"],
        auth: {
          userId: user?.user_id || "anonymous",
        },
      });

      // Lắng nghe sự kiện notification mới
      socketRef.current.on("newNotification", (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
      });

      // Lấy danh sách notification cũ nếu backend hỗ trợ
      socketRef.current.on("notificationList", (data: Notification[]) => {
        setNotifications(data);
      });

      // Cleanup khi unmount hoặc logout
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isAuthenticated, isMember, user?.user_id]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/${encodeURIComponent(encodedName)}`);
  };

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const renderMemberLinks = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-5">
      <motion.div className="space-y-2">
        <motion.h3
          className="font-bold flex items-center"
          whileHover={{ y: -5, color: "#ff0000" }}
        >
          <IconDroplet size={18} className="mr-2" />
          Dịch Vụ Hiến Máu
        </motion.h3>
        {[
          "register-blood",
          "register-blood-emergency",
          "donate-blood",
          "receiver-blood",
        ].map((path) => (
          <DropdownLink
            key={path}
            to={`/${encodedName}/${path}`}
            label={labelMap[path]}
            onClick={() => setShowDropdown(false)}
          />
        ))}
      </motion.div>

      <motion.div className="space-y-2">
        <motion.h3
          className="font-bold flex items-center"
          whileHover={{ y: -5, color: "#ff0000" }}
        >
          <IconBook size={18} className="mr-2" />
          Thông tin
        </motion.h3>
        {infoLinks.map(({ slug, label }) => (
          <DropdownLink
            key={slug}
            to={`/${encodedName}/${slug}`}
            label={label}
            onClick={() => setShowDropdown(false)}
          />
        ))}
      </motion.div>

      <motion.div className="space-y-2">
        <motion.h3
          className="font-bold flex items-center"
          whileHover={{ y: -5, color: "#ff0000" }}
        >
          <IconSearch size={18} className="mr-2" />
          Tìm Kiếm
        </motion.h3>
        <DropdownLink
          to={`/${encodedName}/seek-information`}
          label="Tra Cứu Thông Tin"
          onClick={() => setShowDropdown(false)}
        />
      </motion.div>
      <motion.div className="space-y-2">
        <motion.h3
          className="font-bold flex items-center"
          whileHover={{ y: -5, color: "#ff0000" }}
        >
          <IconUserBolt size={18} className="mr-2" />
          Tài Khoản
        </motion.h3>
        <DropdownLink
          to={`/${encodedName}/user-profile`}
          label="Thông Tin Tài Khoản"
          onClick={() => setShowDropdown(false)}
        />
      </motion.div>

      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        }}
        className="rounded-md overflow-hidden"
      >
        <img
          src={img1}
          alt="promo"
          className="hidden lg:block w-full aspect-video object-cover rounded-md"
        />
      </motion.div>
    </div>
  );

  const renderAdminLinks = () => (
    <motion.div className="p-6 space-y-10">
      <motion.h3
        className="font-bold text-lg flex items-center text-red-700"
        whileHover={{ y: -3 }}
      >
        <IconShieldCheck size={20} className="mr-2" />
        Quản Lý Hệ Thống Cấp Cao
      </motion.h3>
      <div className="flex gap-40 flex-wrap mt-5">
        {adminLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={label}
            to={`/${encodedName}/${to}`}
            className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
            onClick={() => setShowDropdown(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </motion.div>
  );

  const renderStaffLinks = () => (
    <motion.div className="p-6 space-y-10">
      <motion.h3
        className="font-bold text-lg flex items-center text-red-700"
        whileHover={{ y: -3 }}
      >
        <IconShieldCheck size={20} className="mr-2" />
        Quản Lý Hệ Thống Cấp Thấp
      </motion.h3>
      <div className="grid grid-cols-3 gap-8 flex-wrap mt-5">
        {staffLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={label}
            to={`/${encodedName}/${to}`}
            className="flex items-center gap-2 hover:scale-105 hover:text-red-500 transition-all duration-200 font-semibold"
            onClick={() => setShowDropdown(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </motion.div>
  );

  return (
    <header className="bg-gradient-to-r from-red-500 to-red-900 text-gray-300 py-2 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            onClick={handleLogoClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="logo" width={50} height={50} />
          </div>
            <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
            >
            <span className="font-bold text-xl">LUNARIST</span>
            {/* Show IconChevronDown on desktop, hamburger on mobile */}
            <span className="hidden lg:inline">
              {(isMember || isAdmin || isStaff) && (
              <IconChevronDown size={25} />
              )}
            </span>
            <span className="inline lg:hidden">
              <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu(!showMobileMenu);
              }}
              className="text-white"
              >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              </button>
            </span>
            </div>

        </div>

        {isAuthenticated() && (
          <div className="flex items-center gap-4">
            {isMember && (
              <NotificationDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                userId={user?.user_id || ""}
              />
              
            )}


            <span className="text-white">Xin chào, {fullname}</span>
            <motion.button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-700 text-3xs rounded-lg font-bold flex items-center hover:bg-red-500 gap-2 cursor-pointer"
              style={{ color: "white" }}
              whileHover={{
                y: -5,
                scale: 1.05,
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              }}
            >
              <IconLogout size={18} />
              <span>Đăng xuất</span>
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && isAuthenticated() && (
          <motion.div
            ref={dropdownRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="hidden lg:block absolute top-full left-0 w-full bg-white text-black shadow-lg z-50 px-4 md:px-10 lg:px-20 rounded-md"
          >
            {isMember && renderMemberLinks()}
            {isAdmin && renderAdminLinks()}
            {isStaff && renderStaffLinks()}
          </motion.div>
        )}
        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-white text-black p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setShowMobileMenu(false)}>❌</button>
              </div>

              {/* Optional: Bạn có thể render Member, Admin, Staff ở đây */}
              {isMember && renderMemberLinks()}
              {isAdmin && renderAdminLinks()}
              {isStaff && renderStaffLinks()}
            </motion.div>
          )}
        </AnimatePresence>

      </AnimatePresence>
    </header>
  );
}

const labelMap: Record<string, string> = {
  "register-blood": "Đăng ký Hiến Máu",
  "register-blood-emergency": "Đăng ký Nhận Máu Khẩn Cấp",
  "donate-blood": "Hiến Máu",
  "receiver-blood": "Nhận Máu",
};

const infoLinks = [
  { slug: "blood-donation-centers", label: "Cơ sở Hiến Máu" },
  { slug: "blood-documents", label: "Tài Liệu Về Máu" },
  { slug: "blood-news", label: "Tin Tức Về Hiến Máu" },
  { slug: "blood-experience", label: "Chia Sẻ Kinh Nghiệm" },
];

const adminLinks = [
  { to: "controlling-user", label: "Quản Lý Người Dùng", icon: IconUserCog },
  {
    to: "controlling-central",
    label: "Quản Lý Trung Tâm Hiến Máu",
    icon: IconBuildingBank,
  },
  { to: "controlling-storage", label: "Quản Lý Kho Máu", icon: IconDatabase },
  { to: "admin-profile", label: "Tài Khoản", icon: IconUserBolt },
];

const staffLinks = [
    {
    to: "health-controlling",
    label: "Quản Lý Thông Tin Sức Khỏe",
    icon: IconUserCog,
  },
  {
    to: "donate-controlling",
    label: "Quản Lý Đơn Đăng ký Hiến Máu",
    icon: IconUserCancel,
  },

  {
    to: "receiver-controlling",
    label: "Quản Lý Đơn Yêu Cầu Nhận Máu",
    icon: IconBuildingBank,
  },
  {
    to: "storage-controlling",
    label: "Quản Lý Đơn Vị Kho Máu của Trung Tâm",
    icon: IconDatabase,
  },
  { to: "controlling-blood-export", label: "Quản Lý Xuất Máu", icon: IconSettings2 },
  { to: "staff-profile", label: "Tài Khoản", icon: IconUserBolt },
  {
    to: "business-systems",
    label: "Quản Lý Hệ Thống Nghiệp Vụ Máu",
    icon: IconSettings2,
  },
];
