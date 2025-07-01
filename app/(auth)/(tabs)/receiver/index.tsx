import { useHealth } from '@/hooks/HealthInfor/useUser';
import useUser from '@/hooks/user/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useBloodContext } from '@/hooks/Blood/useBlood';
import useCentral from '@/hooks/central/useCentral';
import { useReceiver } from '@/hooks/Receiver/useReceiver';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReceiverScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'Receiver' | 'registered'>('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'bloodType'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nhận Máu</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm theo tên, nhóm máu..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="funnel-outline" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Ionicons 
              name="people-outline" 
              size={20} 
              color={activeTab === 'all' ? '#E91E63' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'all' && styles.activeTabText
            ]}>
              Tất cả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'Receiver' && styles.activeTab]}
            onPress={() => setActiveTab('Receiver')}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={20} 
              color={activeTab === 'Receiver' ? '#E91E63' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'Receiver' && styles.activeTabText
            ]}>
              Chuẩn Bị
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'registered' && styles.activeTab]}
            onPress={() => setActiveTab('registered')}
          >
            <Ionicons 
              name="time-outline" 
              size={20} 
              color={activeTab === 'registered' ? '#E91E63' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'registered' && styles.activeTabText
            ]}>
              Đã đăng ký
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'all' && (
            <AllUsersTable searchText={searchText} sortBy={sortBy} sortOrder={sortOrder} />
          )}
          {activeTab === 'Receiver' && (
            <ReceiverUsersTable searchText={searchText} sortBy={sortBy} sortOrder={sortOrder} />
          )}
          {activeTab === 'registered' && (
            <RegisteredUsersTable searchText={searchText} sortBy={sortBy} sortOrder={sortOrder} />
          )}
        </ScrollView>

        {/* Floating Register Button */}
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {
              left: undefined,
              right: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 20,
            }
          ]}
          onPress={() => setShowRegisterModal(true)}
        >
          <Ionicons name="add" size={18} color="#fff" style={{ alignSelf: 'center' }} />
        </TouchableOpacity>

        {/* Register Modal */}
        <RegisterModal 
          visible={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)} 
        />

        {/* Sort Modal */}
        <SortModal 
          visible={showSortModal}
          onClose={() => setShowSortModal(false)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(newSortBy, newSortOrder) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
            setShowSortModal(false);
          }}
        />
      </View>
    </>
  );
}

// All Users Table Component (Form cố định)
function AllUsersTable({ searchText, sortBy, sortOrder }: any) {
  const { allReceivers, getAllReceiverBloods } = useReceiver();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [getAllReceiverBloods]);

  const handleReload = async () => {
    setLoading(true);
    try {
      await getAllReceiverBloods();
      Toast.show({
        type: 'success',
        text1: 'Đã làm mới danh sách',
        position: 'top',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi tải lại danh sách',
      });
    }
    setLoading(false);
  };

  const users = (allReceivers || []).map((d, index) => {
    const userInfo = d.user_id;
    const userType = d.type || 'unknown';
    return {
      id: d.receiver_id || `${userInfo?.user_id}-${index}`,
      name: userInfo?.fullname || '—',
      bloodType: d.blood_id.blood_id,
      phone: userInfo?.email || '—',
      gender: userInfo?.gender,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      status:
        d.status_donate === 'COMPLETED'
          ? 'Receiver'
          : d.status_regist === 'PENDING'
          ? 'registered'
          : 'inactive',
      lastActivity: d.date_receiver,
      registrationDate: d.date_register,
      location: d.centralBlood_id.centralBlood_name,
      level: d.type || 'Không xác định',
      scheduledDate: d.status_regist === 'PENDING' ? d.date_receiver : undefined,
      type: userType,
    };
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.bloodType.toLowerCase().includes(searchText.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'name') comp = a.name.localeCompare(b.name);
    else if (sortBy === 'bloodType') comp = a.bloodType.localeCompare(b.bloodType);
    else if (sortBy === 'level') comp = (a.level || '').localeCompare(b.level || '');
    else {
      comp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
    }
    return sortOrder === 'desc' ? -comp : comp;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedData = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Receiver':
        return { color: '#4CAF50', text: 'Đã hiến máu', icon: 'checkmark-circle' };
      case 'registered':
        return { color: '#FF9800', text: 'Đã đăng ký', icon: 'time' };
      default:
        return { color: '#666', text: status, icon: 'help-circle' };
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'emergency':
        return { color: '#D32F2F', label: 'Khẩn cấp', icon: 'alert-circle' };
      case 'normal':
        return { color: '#1976D2', label: 'Thông thường', icon: 'information-circle' };
      case 'volunteer':
        return { color: '#388E3C', label: 'Tình nguyện', icon: 'heart' };
      default:
        return { color: '#757575', label: 'Không xác định', icon: 'help-circle' };
    }
  };

  return (
    <View style={styles.tableContainer}>
      <View style={[styles.tableHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={styles.tableTitle}>Danh Sách Người Hiến Máu</Text>
          <Text style={styles.tableSubtitle}>{filtered.length} người</Text>
        </View>
        <TouchableOpacity onPress={handleReload} style={{ backgroundColor: '#E91E63', padding: 8, borderRadius: 8 }}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u) => u.status === 'Receiver').length}
          </Text>
          <Text style={styles.statLabel}>Đã hiến máu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u) => u.status === 'registered').length}
          </Text>
          <Text style={styles.statLabel}>Đã đăng ký</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Tổng bản ghi</Text>
        </View>
      </View>

      {paginatedData.map((user, index) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
        const statusInfo = getStatusInfo(user.status);
        const typeInfo = getTypeStyle(user.type);

        return (
          <TouchableOpacity key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.sttNumber}>#{globalIndex}</Text>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.bloodTypeBadge}>
                    <Text style={styles.bloodTypeText}>{user.bloodType}</Text>
                  </View>
                  <Text style={styles.userAge}>{user.gender}</Text>
                </View>
                <View style={styles.userActivity}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.locationText}>{user.location}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Ionicons name={typeInfo.icon} size={14} color={typeInfo.color} style={{ marginRight: 4 }} />
                  <Text style={{ color: typeInfo.color, fontWeight: 'bold' }}>Loại: {user.level}</Text>
                </View>
              </View>
            </View>

            <View style={styles.userStatus}>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                <Ionicons name={statusInfo.icon} size={12} color="#fff" />
                <Text style={styles.statusText}>{statusInfo.text}</Text>
              </View>
              <Text style={styles.lastActivityText}>
                {new Date(user.lastActivity).toLocaleDateString('vi-VN')}
              </Text>
              {user.scheduledDate && (
                <Text style={styles.scheduledText}>
                  Hẹn: {new Date(user.scheduledDate).toLocaleDateString('vi-VN')}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={[styles.paginationContainer, { alignSelf: 'center', marginTop: 16 }]}>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={[
            styles.pageButton,
            currentPage === 1 && { backgroundColor: '#bdbdbd' }
          ]}
        >
          <Text style={styles.pageButtonText}>{'<'} Trước</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Trang {currentPage} / {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={[
            styles.pageButton,
            currentPage === totalPages && { backgroundColor: '#bdbdbd' }
          ]}
        >
          <Text style={styles.pageButtonText}>Tiếp {'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



// Receiver Users Table Component (Cập nhật)
 function ReceiverUsersTable({ searchText }: { searchText: string }) {
  const { receiverHistory, getReceiverHistoryById } = useReceiver();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const { bloodList} = useBloodContext();

  useEffect(() => {
    const interval = setInterval(() => {
      getReceiverHistoryById();
    }, 1000); // 30s

    return () => clearInterval(interval);
  }, []);

  const handleReload = async () => {
    try {
      await getReceiverHistoryById();
      Toast.show({
        type: 'success',
        text1: 'Danh sách đã được làm mới',
        position: 'top',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi tải lại danh sách',
      });
    }
  };

  const filteredReceivers = receiverHistory?.filter(
    (receiver: any) =>
      receiver.status_donate === 'PENDING' &&
      receiver.status_regist === 'APPROVED' &&
      receiver.centralBlood_id?.centralBlood_name?.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Danh sách đơn Nhận Máu ({filteredReceivers.length})
          </Text>
          <TouchableOpacity
            onPress={handleReload}
            style={{
              backgroundColor: '#E91E63',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {filteredReceivers.map((item: any, index: number) => (
          <View
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              marginBottom: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
              {item.centralBlood_id?.centralBlood_name}
            </Text>
            <Text style={{ color: '#666' }}>
              Ngày nhận máu: {new Date(item.date_receiver).toLocaleDateString('vi-VN')}
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: '#FFD700',
                padding: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setSelectedReceiver(item);
                setModalVisible(true);
              }}
            >
              <Ionicons name="document-text-outline" size={16} color="black" style={{ marginRight: 6 }} />
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Xem chi tiết đơn</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal chi tiết đơn */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '85%',
            maxWidth: 400,
            elevation: 8,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E91E63' }}>Chi tiết đơn nhận máu</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedReceiver && (
              <>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  {selectedReceiver.centralBlood_id?.centralBlood_name}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Địa chỉ: {selectedReceiver.centralBlood_id?.centralBlood_address}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Ngày nhận máu: {new Date(selectedReceiver.date_receiver).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Họ tên người nhận: {selectedReceiver.user_id?.fullname}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  SĐT: {selectedReceiver.user_id?.phone}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Email: {selectedReceiver.user_id?.email}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Giới tính: {selectedReceiver.user_id?.gender}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Ngày sinh: {new Date(selectedReceiver.user_id?.dob).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Nhóm máu: {
                  (() => {
                    // Lấy blood_id của đơn
                    const bloodId = selectedReceiver.blood_id?.blood_id;
                    // Lấy bloodList từ hook
                    // (hook đã được khai báo ở trên: const { bloodList } = useBloodContext();)
                    const blood = Array.isArray(bloodList)
                    ? bloodList.find((b) => b.blood_id === bloodId)
                    : null;
                    // Hiển thị theo format gốc, ví dụ: A(-)
                    return blood
                    ? `${blood.blood_type_id?.blood_name || ''}(${blood.rh_id?.blood_Rh || ''})`
                    : 'Không xác định';
                  })()
                  }
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Loại đơn: {selectedReceiver.type === 'EMERGENCY' ? 'Khẩn cấp' : 'Thông thường'}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Đơn vị máu cần: {selectedReceiver.unit} đơn vị ({selectedReceiver.ml} ml)
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Trạng thái nhận máu: {selectedReceiver.status_receiver}
                </Text>
              </>
            )}

            <TouchableOpacity
              style={{
                marginTop: 16,
                backgroundColor: '#E91E63',
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
// Registered Users Table Component (Cập nhật)
 function RegisteredUsersTable({ searchText }: { searchText: string }) {
  const { receiverHistory, getReceiverHistoryById } = useReceiver();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);
  const { bloodList} = useBloodContext();

  useEffect(() => {
    const interval = setInterval(() => {
      getReceiverHistoryById();
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, []);

  const handleReload = async () => {
    try {
      await getReceiverHistoryById();
      Toast.show({
        type: 'success',
        text1: 'Danh sách đã được làm mới',
        position: 'top',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi tải lại danh sách',
      });
    }
  };

  // Lọc các đơn đăng ký với status_donate & status_regist = PENDING
  const filteredReceivers = receiverHistory?.filter((receiver: any) => {
    const search = searchText.toLowerCase();
    return (
      receiver.status_donate === 'PENDING' &&
      receiver.status_regist === 'PENDING' &&
      (
        receiver.centralBlood_id?.centralBlood_name?.toLowerCase().includes(search) ||
        receiver.user_id?.fullname?.toLowerCase().includes(search) ||
        `${receiver.blood_id?.blood_type_id}${receiver.blood_id?.rh_id === 1 ? '+' : '-'}`.includes(search)
      )
    );
  }) || [];

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Danh sách đơn đăng ký ({filteredReceivers.length})
          </Text>
          <TouchableOpacity
            onPress={handleReload}
            style={{
              backgroundColor: '#E91E63',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {filteredReceivers.map((item: any, index: number) => (
          <View
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              marginBottom: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {item.user_id?.fullname}
              </Text>
              <Text style={{ color: '#666' }}>
                Ngày đăng ký: {new Date(item.date_register).toLocaleDateString('vi-VN')}
              </Text>
                <Text style={{ color: '#999' }}>
                Nhóm máu: {
                  (() => {
                  const bloodId = item.blood_id?.blood_id;
                  const blood = Array.isArray(bloodList)
                    ? bloodList.find((b) => b.blood_id === bloodId)
                    : null;
                  return blood
                    ? `${blood.blood_type_id?.blood_name || ''}(${blood.rh_id?.blood_Rh || ''})`
                    : 'Không xác định';
                  })()
                }
                </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#FFD700',
                padding: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setSelectedReceiver(item);
                setModalVisible(true);
              }}
            >
              <Ionicons name="document-text-outline" size={16} color="black" style={{ marginRight: 6 }} />
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Xem chi tiết đơn</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal chi tiết đơn */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '85%',
            maxWidth: 400,
            elevation: 8,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E91E63' }}>
                Chi tiết đơn đăng ký
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedReceiver && (
              <>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  {selectedReceiver.centralBlood_id?.centralBlood_name}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Địa chỉ: {selectedReceiver.centralBlood_id?.centralBlood_address}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Ngày đăng ký: {new Date(selectedReceiver.date_register).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Họ tên: {selectedReceiver.user_id?.fullname}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Email: {selectedReceiver.user_id?.email}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  SĐT: {selectedReceiver.user_id?.phone}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Giới tính: {selectedReceiver.user_id?.gender}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Ngày sinh: {new Date(selectedReceiver.user_id?.dob).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={{ color: '#666', marginBottom: 4 }}>
                  Nhóm máu: {
                  (() => {
                    const bloodId = selectedReceiver.blood_id?.blood_id;
                    const blood = Array.isArray(bloodList)
                    ? bloodList.find((b) => b.blood_id === bloodId)
                    : null;
                    return blood
                    ? `${blood.blood_type_id?.blood_name || ''}(${blood.rh_id?.blood_Rh || ''})`
                    : 'Không xác định';
                  })()
                  }
                </Text>
              </>
            )}

            <TouchableOpacity
              style={{
                marginTop: 16,
                backgroundColor: '#E91E63',
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Sort Modal Component
function SortModal({ visible, onClose, sortBy, sortOrder, onSortChange }: any) {
  const sortOptions = [
    { key: 'date', label: 'Ngày hoạt động', icon: 'calendar-outline' },
    { key: 'name', label: 'Tên', icon: 'person-outline' },
    { key: 'bloodType', label: 'Nhóm máu', icon: 'water-outline' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.sortModalContainer}>
          <View style={styles.sortModalHeader}>
            <Text style={styles.sortModalTitle}>Sắp xếp theo</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.sortOption}
              onPress={() => {
                const newOrder = sortBy === option.key && sortOrder === 'asc' ? 'desc' : 'asc';
                onSortChange(option.key, newOrder);
              }}
            >
              <View style={styles.sortOptionLeft}>
                <Ionicons name={option.icon} size={20} color="#E91E63" />
                <Text style={styles.sortOptionText}>{option.label}</Text>
              </View>
              {sortBy === option.key && (
                <Ionicons 
                  name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                  size={20} 
                  color="#E91E63" 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

// Register Modal Component (giữ nguyên như trước)
type Step = 'healthInfo' | 'userInfo' | 'confirm';

function RegisterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState<Step>('healthInfo');
  const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setCurrentStep('healthInfo');
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Đăng ký hiến máu</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            {['healthInfo', 'userInfo', 'confirm'].map((step, index) => (
              <React.Fragment key={step}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, currentStep === step && styles.activeStepCircle]}>
                    <Ionicons
                      name={
                        step === 'healthInfo'
                          ? 'heart-outline'
                          : step === 'userInfo'
                          ? 'person-outline'
                          : 'document-text-outline'
                      }
                      size={16}
                      color={currentStep === step ? '#fff' : '#666'}
                    />
                  </View>
                  <Text style={[styles.stepLabel, currentStep === step && styles.activeStepLabel]}>
                    {step === 'healthInfo'
                      ? 'Sức khỏe'
                      : step === 'userInfo'
                      ? 'Cá nhân'
                      : 'Xác nhận'}
                  </Text>
                </View>
                {index < 2 && <View style={styles.stepConnector} />}
              </React.Fragment>
            ))}
          </View>

          {/* Form Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {currentStep === 'healthInfo' && (
                <HealthInfoForm
                    onBack={handleClose}
                    onNext={() => setCurrentStep('userInfo')} // ✅ đổi từ onSubmit sang onNext
                />
                )}
            {currentStep === 'userInfo' && (
              <UserInfoForm
                onNext={() => setCurrentStep('confirm')}
                onBack={() => setCurrentStep('healthInfo')}
              />
            )}
            {currentStep === 'confirm' && (
              <ConfirmForm onBack={() => setCurrentStep('userInfo')} onSubmit={handleClose} />
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}


// User Info Form Component (giữ nguyên)
function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function UserInfoForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { userData } = useUser();
  const user = userData?.data;

  return (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.backButtonForm} onPress={onBack}>
        <Ionicons name="chevron-back" size={20} color="#E91E63" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Thông tin cá nhân</Text>

      {/* Họ và tên */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Họ và tên *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={user?.fullname} editable={false} />
        </View>
      </View>

      {/* Ngày sinh và giới tính */}
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Ngày sinh *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={user?.dob ? formatDate(user.dob) : ''}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Giới tính *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="transgender-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput style={styles.textInput} value={user?.gender} editable={false} />
          </View>
        </View>
      </View>

      {/* Số điện thoại */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Số điện thoại *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={user?.phone} editable={false} />
        </View>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={user?.email} editable={false} />
        </View>
      </View>

      {/* Số nhà và đường */}
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Số nhà *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={user?.location_id?.house_number || ''}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Đường *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="navigate-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={user?.location_id?.road || ''}
              editable={false}
            />
          </View>
        </View>
      </View>

      {/* Quận và Thành Phố */}
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Quận *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={user?.location_id?.district || ''}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Thành Phố *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="map-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={user?.location_id?.city || ''}
              editable={false}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>Tiếp theo</Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Health Info Form Component (giữ nguyên)
function HealthInfoForm({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { userHealth } = useHealth();
  const { bloodList} = useBloodContext();

  return (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.backButtonForm} onPress={onBack}>
        <Ionicons name="chevron-back" size={20} color="#E91E63" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Thông tin sức khỏe</Text>

      {/* Họ tên */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tên người điền</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={userHealth?.user_id?.fullname || ''} editable={false} />
        </View>
      </View>

      {/* Cân nặng & Chiều cao */}
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="fitness-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={userHealth?.weight_decimal?.toString() || ''}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="resize-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={userHealth?.height?.toString() || ''}
              editable={false}
            />
          </View>
        </View>
      </View>

      {/* Huyết áp */}
      <View style={styles.inputRow}>
        {/* Huyết áp */}
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Huyết áp</Text>
          <View style={styles.inputContainer}>
        <Ionicons name="heart-outline" size={20} color="#E91E63" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          value={userHealth?.blood_pressure?.toString() || ''}
          editable={false}
        />
          </View>
        </View>
        {/* Nhóm máu */}
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Nhóm máu</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="water-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={
          (() => {
            const bloodId = userHealth?.blood_id?.blood_id;
            if (!bloodId || !Array.isArray(bloodList)) return '';
            const blood = bloodList.find((b) => b.blood_id === bloodId);
            return blood
              ? `${blood.blood_type_id?.blood_name || ''}(${blood.rh_id?.blood_Rh || ''})`
              : '';
          })()
              }
              editable={false}
            />
          </View>
        </View>
      </View>
      <View style={styles.inputRow}>
        {/* Lần hiến máu gần nhất và Tình trạng sức khỏe trên cùng 1 dòng */}
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Lần hiến máu gần nhất</Text>
          <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={20} color="#E91E63" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          value={userHealth?.latest_donate?.slice(0, 10) || ''}
          editable={false}
        />
          </View>
        </View>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Tình trạng hiện tại</Text>
          <View style={styles.inputContainer}>
        <Ionicons name="pulse-outline" size={20} color="#E91E63" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          value={userHealth?.status_health || ''}
          editable={false}
        />
          </View>
        </View>
      </View>
      {/* Tiền sử bệnh */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tiền sử bệnh lý</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <Ionicons name="medical-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={userHealth?.medical_history || ''}
            editable={false}
          />
        </View>
      </View>

      {/* Lần hiến máu gần nhất */}


      {/* Ảnh giấy khám sức khỏe */}
      {userHealth?.img_health && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ảnh giấy khám sức khỏe</Text>
          <Image
            source={{ uri: userHealth.img_health }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
            contentFit="contain"
          />
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>Tiếp theo</Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}



function ConfirmForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const { createReceiver } = useReceiver();
  const { central } = useCentral();
  const { bloodList, loading } = useBloodContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [bloodId, setBloodId] = useState<string | null>(null);
  const [ml, setMl] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [priorityType, setPriorityType] = useState<'DEFAULT' | 'EMERGENCY'>('DEFAULT');

  const handleSubmit = async () => {
    if (!selectedCenter || !bloodId || !ml || !unit) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng điền đầy đủ tất cả các trường!',
        position: 'top',
      });
      return;
    }

    try {
      const payload = {
        blood_id: String(bloodId),
        date_receiver: selectedDate.toISOString(),
        ml: Number(ml),
        unit: Number(unit),
        type: String(priorityType),
        centralBlood_id: String(selectedCenter),
      };

      await createReceiver(payload);

      Toast.show({
        type: 'success',
        text1: 'Tạo yêu cầu thành công 🎉',
        position: 'top',
      });

      onSubmit();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã xảy ra lỗi khi gửi đơn',
        text2: 'Vui lòng thử lại sau.',
        position: 'top',
      });
      console.log("Lỗi khi gửi đơn:", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButtonForm} onPress={onBack}>
        <Ionicons name="chevron-back" size={20} color="#E91E63" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Tạo yêu cầu nhận máu</Text>

      {/* Ngày nhận máu */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ngày nhận máu</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.inputContainer, { paddingVertical: 12 }]}
        >
          <Ionicons name="calendar" size={20} color="#E91E63" style={styles.inputIcon} />
          <Text style={styles.textInput}>{selectedDate.toLocaleDateString('vi-VN')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today) {
                  Toast.show({
                    type: 'error',
                    text1: 'Không thể chọn ngày trong quá khứ!',
                    position: 'top',
                  });
                } else {
                  setSelectedDate(date);
                }
              }
            }}
          />
        )}
      </View>

      {/* Nhóm máu */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nhóm máu</Text>
        <View style={[styles.inputContainer, { minHeight: 60 }]}>
          <Ionicons name="water-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <Picker
            selectedValue={bloodId}
            onValueChange={(val) => setBloodId(val)}
            style={{ flex: 1 }}
            dropdownIconColor="#E91E63"
          >
            <Picker.Item label="-- Chọn nhóm máu --" value={null} />
            {!loading &&
              Array.isArray(bloodList) &&
              bloodList.map((item) => (
                <Picker.Item
                  key={item.blood_id}
                  label={`${item.blood_type_id.blood_name}(${item.rh_id.blood_Rh})`}
                  value={item.blood_id}
                />
              ))}
          </Picker>
        </View>
      </View>

      {/* Số lượng máu (ml) */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Số lượng máu (ml)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="flask-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Nhập số ml"
            value={ml}
            onChangeText={(text) => {
              let numeric = text.replace(/[^0-9]/g, '');
              if (numeric && parseInt(numeric, 10) < 50) {
                numeric = '50';
                Toast.show({
                  type: 'error',
                  text1: 'Số lượng tối thiểu là 50ml',
                  position: 'top',
                });
              }
              setMl(numeric);
            }}
          />
        </View>
      </View>

      {/* Đơn vị máu */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Số đơn vị máu</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="albums-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Nhập số đơn vị"
            value={unit}
            onChangeText={setUnit}
          />
        </View>
      </View>

      {/* Mức độ ưu tiên */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Mức độ ưu tiên</Text>
        <View style={[styles.inputContainer, { minHeight: 60 }]}>
          <Ionicons name="alert-circle-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <Picker
            selectedValue={priorityType}
            onValueChange={(val) => setPriorityType(val)}
            style={{ flex: 1 }}
            dropdownIconColor="#E91E63"
          >
            <Picker.Item label="Thông thường" value="DEFAULT" />
            <Picker.Item label="Khẩn cấp" value="EMERGENCY" />
          </Picker>
        </View>
      </View>

      {/* Trung tâm hiến máu */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Trung tâm hiến máu</Text>
        <View style={[styles.inputContainer, { minHeight: 60 }]}>
          <Ionicons name="business-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <Picker
            selectedValue={selectedCenter}
            onValueChange={(val) => setSelectedCenter(val)}
            style={{ flex: 1 }}
            dropdownIconColor="#E91E63"
          >
            <Picker.Item label="-- Chọn trung tâm --" value={null} />
            {central?.map((item) => (
              <Picker.Item
                key={item.centralBlood_id}
                label={`${item.centralBlood_name} - ${item.centralBlood_address}`}
                value={item.centralBlood_id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Nút gửi đơn */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Xác nhận và gửi đơn</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    padding: 12,
  },
  tabContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#fce4ec',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#E91E63',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24, // Thêm margin dưới để tránh dính vào pagination
  },
  tableHeader: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bloodTypeBadge: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  bloodTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userAge: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  ReceiverCountBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ReceiverCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  userActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ReceiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  registrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  registrationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  lastActivityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  scheduledText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
    marginBottom: 8,
  },
  ReceiverDetails: {
    alignItems: 'flex-end',
  },
  ReceiverAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
    marginBottom: 2,
  },
  ReceiverDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  registrationDetails: {
    alignItems: 'flex-end',
  },
  registrationDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#fce4ec',
    borderRadius: 15,
    padding: 6,
  },
  historyButton: {
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#E91E63',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#E91E63',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.9,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStepCircle: {
    backgroundColor: '#E91E63',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#E91E63',
    fontWeight: '600',
  },
  stepConnector: {
    width: 60,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 80,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  backButtonForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sortModalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  // Pagination nằm giữa table
sttNumber: {
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 10,
  color: '#555',
},

paginationContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
},

pageButton: {
  backgroundColor: '#1976D2',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},

pageButtonText: {
  color: '#fff',
  fontWeight: '600',
},

pageInfo: {
  marginHorizontal: 12,
  fontWeight: '500',
  color: '#333',
},

});