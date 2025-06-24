import React, { useState, useEffect } from "react";
import { Button, Card, Input, message, Modal } from "antd";
import dayjs from "dayjs";

import useStorage from "../../../hooks/storage/useStorage";
import useBloodService from "../../../hooks/Blood/useBloodService";
import useCentralService from "../../../hooks/CentralBlood/useCentralService";
import { motion } from "framer-motion";
import FormCreate from "./FormCreate";
import TableStorage, { type StorageRecord } from "./TableStorage";
import {
  IconDatabaseEdit,
  IconDatabasePlus,
  IconRefresh,
} from "@tabler/icons-react";

export default function ControllingStorage() {
  const [allStorages, setAllStorages] = useState<StorageRecord[]>([]);
  const [storages, setStorages] = useState<StorageRecord[]>([]);
  const [editingStorage, setEditingStorage] = useState<StorageRecord | null>(
    null
  );
  const [viewingStorage, setViewingStorage] = useState<StorageRecord | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [bloods, setBloods] = useState([]);
  const [centrals, setCentrals] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const { getStorages, createStorage, updateStorage, deleteStorage } =
    useStorage();
  const { getAllBloods } = useBloodService();
  const { getAllCentral } = useCentralService();

  // Load all storages once
  const fetchAllStorages = async () => {
    setLoading(true);
    try {
      const res = await getStorages(); // giả sử getStorages() không cần truyền param để lấy full list
      const data = res.data.result;
      setAllStorages(data);
      applyFilterAndPagination(
        data,
        searchText,
        pagination.current,
        pagination.pageSize
      );
    } catch (error) {
      message.error("Failed to load storages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by fullname and paginate
  const applyFilterAndPagination = (
    data: StorageRecord[],
    search: string,
    currentPage: number,
    pageSize: number
  ) => {
    const filtered = data.filter((item) => {
      const fullname = item?.donate_id?.infor_health?.user_id?.fullname || "";
      return fullname.toLowerCase().includes(search.toLowerCase());
    });

    const startIndex = (currentPage - 1) * pageSize;
    const paged = filtered.slice(startIndex, startIndex + pageSize);

    setStorages(paged);
    setPagination({
      current: currentPage,
      pageSize,
      total: filtered.length,
    });
  };

  // Load bloods and centrals
  const fetchBloodsAndCentrals = async () => {
    try {
      const bloodRes = await getAllBloods();
      const centralRes = await getAllCentral();
      setBloods(bloodRes.data.result);
      setCentrals(centralRes.data.result);
    } catch {
      message.error("Failed to load bloods or centrals");
    }
  };

  useEffect(() => {
    fetchAllStorages();
    fetchBloodsAndCentrals();
  }, []);

  // Submit create/update
  const handleSubmit = async (values) => {
    try {
      if (editingStorage) {
        await updateStorage(editingStorage.storage_id, values);
        message.success("Updated successfully");
      } else {
        await createStorage(values);
        message.success("Created successfully");
      }
      setEditingStorage(null);
      // Reload all data after change
      fetchAllStorages();
    } catch (err) {
      message.error("Submit failed");
      console.error(err);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await deleteStorage(id);
      message.success("Deleted successfully");
      fetchAllStorages();
    } catch {
      message.error("Delete failed");
    }
  };

  return (
    <div className="p-8 w-full overflow-hidden flex flex-col gap-6">
      {/* 👉 Tiêu đề nằm trên cùng */}
      <motion.h2
        initial={{ x: 0, color: "#000" }}
        whileHover={{ x: 8, color: "#f43f5e" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="self-start text-base font-bold flex items-center gap-2 "
      >
        <IconDatabasePlus size={20} className="text-red-500" />
        Quản Lý Đơn Vị Kho Máu Trung Tâm
      </motion.h2>

      {/* 👉 Khối chia 2 cột: Form + Table */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <Card
            title={
              <div className="flex items-center gap-2">
                {editingStorage ? (
                  <>
                    <IconDatabaseEdit size={18} /> Edit Storage
                  </>
                ) : (
                  <>
                    <IconDatabasePlus size={18} /> Add Storage
                  </>
                )}
              </div>
            }
          >
            <FormCreate
              editingStorage={editingStorage}
              onSubmit={handleSubmit}
              bloods={bloods}
              centrals={centrals}
              onCancelEdit={() => setEditingStorage(null)}
            />
          </Card>
        </div>

        <div className="w-full lg:w-2/3 overflow-x-auto">
          <Card
            title={
              <div className="flex items-center gap-2">
                <IconDatabaseEdit size={18} />
                Storages Blood
              </div>
            }
            extra={
              <div className="flex gap-2">
                <Input.Search
                  placeholder="Search by Donor"
                  allowClear
                  className="w-64"
                  value={searchText}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchText(value);
                    applyFilterAndPagination(
                      allStorages,
                      value,
                      1,
                      pagination.pageSize
                    );
                  }}
                  onSearch={(value) => {
                    setSearchText(value);
                    applyFilterAndPagination(
                      allStorages,
                      value,
                      1,
                      pagination.pageSize
                    );
                  }}
                />

                <Button
                  icon={<IconRefresh size={16} />}
                  onClick={() => fetchAllStorages()}
                >
                  Reload
                </Button>
              </div>
            }
          >
            <TableStorage
              storages={storages}
              loading={loading}
              pagination={pagination}
              bloods={bloods}
              onPageChange={(page, pageSize) =>
                applyFilterAndPagination(
                  allStorages,
                  searchText,
                  page,
                  pageSize
                )
              }
              onPageSizeChange={(size) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: size,
                  current: 1,
                }));
                applyFilterAndPagination(allStorages, searchText, 1, size);
              }}
              onView={setViewingStorage}
              onEdit={setEditingStorage}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={!!viewingStorage}
        onCancel={() => setViewingStorage(null)}
        footer={null}
        title="Storage Details"
      >
        {viewingStorage && (
          <div className="space-y-2">
            <p>
              <b>Storage ID:</b> {viewingStorage.storage_id}
            </p>
            <p>
              <b>Donate ID:</b> {viewingStorage.donate_id?.donate_id}
            </p>
            <p>
              <b>Donor Name:</b>{" "}
              {viewingStorage?.donate_id?.infor_health?.user_id?.fullname ||
                "Unknown"}
            </p>
            <p>
              <b>Date:</b> {dayjs(viewingStorage.date).format("YYYY-MM-DD")}
            </p>
            <p>
              <b>ML:</b> {viewingStorage.ml}
            </p>
            <p>
              <b>Unit:</b> {viewingStorage.unit}
            </p>
            <p>
              <b>Expired Date:</b>{" "}
              {dayjs(viewingStorage.expired_date).format("YYYY-MM-DD")}
            </p>
            <p>
              <b>Status:</b> {viewingStorage.current_status}
            </p>
            <p>
              <b>Center:</b> {viewingStorage.centralBlood_id?.centralBlood_name}
            </p>
            <p>
              <b>Center Address:</b>{" "}
              {viewingStorage.centralBlood_id?.centralBlood_address}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
