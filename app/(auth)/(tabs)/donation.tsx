import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DonationScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'donated' | 'registered'>('all');
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
          <Text style={styles.headerTitle}>Quản lý hiến máu</Text>
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
            style={[styles.tab, activeTab === 'donated' && styles.activeTab]}
            onPress={() => setActiveTab('donated')}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={20} 
              color={activeTab === 'donated' ? '#E91E63' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'donated' && styles.activeTabText
            ]}>
              Đã hiến
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
          {activeTab === 'donated' && (
            <DonatedUsersTable searchText={searchText} sortBy={sortBy} sortOrder={sortOrder} />
          )}
          {activeTab === 'registered' && (
            <RegisteredUsersTable searchText={searchText} sortBy={sortBy} sortOrder={sortOrder} />
          )}
        </ScrollView>

        {/* Floating Register Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setShowRegisterModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.floatingButtonText}>Đăng ký</Text>
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
  const allUsers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      bloodType: 'A+',
      phone: '0123456789',
      age: 28,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      status: 'donated', // donated, registered, inactive
      lastActivity: '2024-01-15',
      donationCount: 3,
      registrationDate: '2024-01-10',
      location: 'BV Chợ Rẫy',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      bloodType: 'O+',
      phone: '0987654321',
      age: 25,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      status: 'donated',
      lastActivity: '2024-01-14',
      donationCount: 1,
      registrationDate: '2024-01-12',
      location: 'Viện Huyết học',
    },
    {
      id: 3,
      name: 'Phạm Văn D',
      bloodType: 'AB+',
      phone: '0147258369',
      age: 30,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      status: 'registered',
      lastActivity: '2024-01-16',
      donationCount: 0,
      registrationDate: '2024-01-16',
      location: 'BV Chợ Rẫy',
      scheduledDate: '2024-01-20',
    },
    {
      id: 4,
      name: 'Hoàng Thị E',
      bloodType: 'A-',
      phone: '0258147369',
      age: 27,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      status: 'registered',
      lastActivity: '2024-01-15',
      donationCount: 0,
      registrationDate: '2024-01-15',
      location: 'Viện Huyết học',
      scheduledDate: '2024-01-19',
    },
    {
      id: 5,
      name: 'Lê Văn C',
      bloodType: 'B+',
      phone: '0369852147',
      age: 32,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      status: 'donated',
      lastActivity: '2024-01-13',
      donationCount: 2,
      registrationDate: '2024-01-08',
      location: 'BV Đại học Y Dược',
    },
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.bloodType.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'bloodType':
        comparison = a.bloodType.localeCompare(b.bloodType);
        break;
      case 'date':
        comparison = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'donated':
        return { color: '#4CAF50', text: 'Đã hiến máu', icon: 'checkmark-circle' };
      case 'registered':
        return { color: '#FF9800', text: 'Đã đăng ký', icon: 'time' };
      case 'inactive':
        return { color: '#666', text: 'Không hoạt động', icon: 'pause-circle' };
      default:
        return { color: '#666', text: status, icon: 'help-circle' };
    }
  };

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>Tất cả người dùng</Text>
        <Text style={styles.tableSubtitle}>{sortedUsers.length} người</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{allUsers.filter(u => u.status === 'donated').length}</Text>
          <Text style={styles.statLabel}>Đã hiến máu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{allUsers.filter(u => u.status === 'registered').length}</Text>
          <Text style={styles.statLabel}>Đã đăng ký</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{allUsers.reduce((sum, u) => sum + u.donationCount, 0)}</Text>
          <Text style={styles.statLabel}>Tổng lần hiến</Text>
        </View>
      </View>

      {sortedUsers.map((user) => {
        const statusInfo = getStatusInfo(user.status);
        return (
          <TouchableOpacity key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.bloodTypeBadge}>
                    <Text style={styles.bloodTypeText}>{user.bloodType}</Text>
                  </View>
                  <Text style={styles.userAge}>{user.age} tuổi</Text>
                  <View style={styles.donationCountBadge}>
                    <Text style={styles.donationCountText}>{user.donationCount} lần</Text>
                  </View>
                </View>
                <View style={styles.userActivity}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.locationText}>{user.location}</Text>
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
              {user.status === 'registered' && user.scheduledDate && (
                <Text style={styles.scheduledText}>
                  Hẹn: {new Date(user.scheduledDate).toLocaleDateString('vi-VN')}
                </Text>
              )}
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call-outline" size={16} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Donated Users Table Component (Cập nhật)
function DonatedUsersTable({ searchText, sortBy, sortOrder }: any) {
  const donatedUsers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      bloodType: 'A+',
      donatedDate: '2024-01-15',
      location: 'BV Chợ Rẫy',
      amount: '450ml',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      phone: '0123456789',
      age: 28,
      registrationDate: '2024-01-10', // Ngày đăng ký ban đầu
      donationHistory: [
        { date: '2024-01-15', amount: '450ml', location: 'BV Chợ Rẫy' },
        { date: '2023-10-20', amount: '450ml', location: 'BV Chợ Rẫy' },
        { date: '2023-07-15', amount: '450ml', location: 'Viện Huyết học' },
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      bloodType: 'O+',
      donatedDate: '2024-01-14',
      location: 'Viện Huyết học',
      amount: '450ml',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      phone: '0987654321',
      age: 25,
      registrationDate: '2024-01-12',
      donationHistory: [
        { date: '2024-01-14', amount: '450ml', location: 'Viện Huyết học' },
      ]
    },
    {
      id: 3,
      name: 'Lê Văn C',
      bloodType: 'B+',
      donatedDate: '2024-01-13',
      location: 'BV Đại học Y Dược',
      amount: '450ml',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      phone: '0369852147',
      age: 32,
      registrationDate: '2024-01-08',
      donationHistory: [
        { date: '2024-01-13', amount: '450ml', location: 'BV Đại học Y Dược' },
        { date: '2023-11-10', amount: '450ml', location: 'BV Chợ Rẫy' },
      ]
    },
  ];

  const filteredUsers = donatedUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.bloodType.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>Danh sách người đã hiến máu</Text>
        <Text style={styles.tableSubtitle}>{filteredUsers.length} người</Text>
      </View>

      {filteredUsers.map((user) => (
        <TouchableOpacity key={user.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.userMeta}>
                <View style={styles.bloodTypeBadge}>
                  <Text style={styles.bloodTypeText}>{user.bloodType}</Text>
                </View>
                <Text style={styles.userAge}>{user.age} tuổi</Text>
                <View style={styles.donationCountBadge}>
                  <Text style={styles.donationCountText}>{user.donationHistory.length} lần</Text>
                </View>
              </View>
              <View style={styles.donationInfo}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
              <View style={styles.registrationInfo}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.registrationText}>
                  Đăng ký: {new Date(user.registrationDate).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.donationDetails}>
            <Text style={styles.donationAmount}>{user.amount}</Text>
            <Text style={styles.donationDate}>
              {new Date(user.donatedDate).toLocaleDateString('vi-VN')}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.historyButton}>
                <Ionicons name="time-outline" size={14} color="#E91E63" />
                <Text style={styles.historyButtonText}>Lịch sử</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call-outline" size={16} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Registered Users Table Component (Cập nhật)
function RegisteredUsersTable({ searchText, sortBy, sortOrder }: any) {
  const registeredUsers = [
    {
      id: 1,
      name: 'Phạm Văn D',
      bloodType: 'AB+',
      registeredDate: '2024-01-16',
      scheduledDate: '2024-01-20',
      location: 'BV Chợ Rẫy',
      status: 'confirmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      phone: '0147258369',
      age: 30,
    },
    {
      id: 2,
      name: 'Hoàng Thị E',
      bloodType: 'A-',
      registeredDate: '2024-01-15',
      scheduledDate: '2024-01-19',
      location: 'Viện Huyết học',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      phone: '0258147369',
      age: 27,
    },
  ];

  const filteredUsers = registeredUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.bloodType.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleMoveToCompleted = (userId: number) => {
    // Logic chuyển từ đăng ký sang hoàn thành hiến máu
    console.log('Chuyển user', userId, 'sang bảng đã hiến máu');
  };

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>Danh sách người đã đăng ký</Text>
        <Text style={styles.tableSubtitle}>{filteredUsers.length} người</Text>
      </View>

      {filteredUsers.map((user) => (
        <TouchableOpacity key={user.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.userMeta}>
                <View style={styles.bloodTypeBadge}>
                  <Text style={styles.bloodTypeText}>{user.bloodType}</Text>
                </View>
                <Text style={styles.userAge}>{user.age} tuổi</Text>
              </View>
              <View style={styles.donationInfo}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.locationText}>
                  Hẹn: {new Date(user.scheduledDate).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View style={styles.donationInfo}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.registrationDetails}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(user.status) }
            ]}>
              <Text style={styles.statusText}>{getStatusText(user.status)}</Text>
            </View>
            <Text style={styles.registrationDate}>
              Đăng ký: {new Date(user.registeredDate).toLocaleDateString('vi-VN')}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => handleMoveToCompleted(user.id)}
              >
                <Ionicons name="checkmark-outline" size={14} color="#fff" />
                <Text style={styles.completeButtonText}>Hoàn thành</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call-outline" size={16} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
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
function RegisterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState<'userInfo' | 'healthInfo'>('userInfo');
  const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  React.useEffect(() => {
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
      setCurrentStep('userInfo');
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Đăng ký hiến máu</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                currentStep === 'userInfo' && styles.activeStepCircle
              ]}>
                <Ionicons 
                  name="person-outline" 
                  size={16} 
                  color={currentStep === 'userInfo' ? '#fff' : '#666'} 
                />
              </View>
              <Text style={[
                styles.stepLabel,
                currentStep === 'userInfo' && styles.activeStepLabel
              ]}>Thông tin cá nhân</Text>
            </View>
            
            <View style={styles.stepConnector} />
            
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                currentStep === 'healthInfo' && styles.activeStepCircle
              ]}>
                <Ionicons 
                  name="heart-outline" 
                  size={16} 
                  color={currentStep === 'healthInfo' ? '#fff' : '#666'} 
                />
              </View>
              <Text style={[
                styles.stepLabel,
                currentStep === 'healthInfo' && styles.activeStepLabel
              ]}>Thông tin sức khỏe</Text>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {currentStep === 'userInfo' ? (
              <UserInfoForm onNext={() => setCurrentStep('healthInfo')} />
            ) : (
              <HealthInfoForm onBack={() => setCurrentStep('userInfo')} onSubmit={handleClose} />
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// User Info Form Component (giữ nguyên)
function UserInfoForm({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Thông tin cá nhân</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Họ và tên *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Tuổi *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="25"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Nhóm máu *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="water-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="A+"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Số điện thoại *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="0123456789"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Địa chỉ *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#999"
          />
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
function HealthInfoForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.backButtonForm} onPress={onBack}>
        <Ionicons name="chevron-back" size={20} color="#E91E63" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Thông tin sức khỏe</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Cân nặng (kg) *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="fitness-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="65"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Chiều cao (cm) *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="resize-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="170"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Huyết áp *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="heart-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="120/80"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tiền sử bệnh lý</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <Ionicons name="medical-outline" size={20} color="#E91E63" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Mô tả tiền sử bệnh lý (nếu có)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Hoàn thành đăng ký</Text>
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
  donationCountBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  donationCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  userActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  donationInfo: {
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
  donationDetails: {
    alignItems: 'flex-end',
  },
  donationAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
    marginBottom: 2,
  },
  donationDate: {
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
});