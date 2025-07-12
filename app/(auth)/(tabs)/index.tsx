import useUser from "@/hooks/user/useUser";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import NotificationsScreen from "@/components/notifications/notiView";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useNotification from "@/hooks/notification/useNotification";
import { useNotificationContext } from "@/hooks/notification/NotificationContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const { userData } = useUser();
  const [searchText, setSearchText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotificationContext(); 

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowNotifications(false);
      };
    }, [])
  );

  const mainFeatures = [
    {
      id: 1,
      title: "Nhận Máu",
      subtitle: "Tìm kiếm máu cần thiết",
      icon: "medical-outline",
      color: "#E91E63",
      bgColor: "#fce4ec",
    },
    {
      id: 2,
      title: "Hiến Máu",
      subtitle: "Đăng ký hiến máu",
      icon: "heart-outline",
      color: "#2196F3",
      bgColor: "#e3f2fd",
    },
    {
      id: 3,
      title: "Tìm Kiếm Gần Đây",
      subtitle: "Máu gần khu vực của bạn",
      icon: "location-outline",
      color: "#4CAF50",
      bgColor: "#e8f5e8",
    },
    {
      id: 4,
      title: "Tin Tức",
      subtitle: "Cập nhật thông tin mới",
      icon: "newspaper-outline",
      color: "#FF9800",
      bgColor: "#fff3e0",
    },
  ];

  const quickStats = [
    { label: "Yêu cầu hôm nay", value: "24", icon: "trending-up" },
    { label: "Người hiến máu", value: "1.2K", icon: "people" },
    { label: "Sinh mạng cứu sống", value: "856", icon: "heart" },
  ];

  const donationSteps = [
    {
      id: 1,
      title: "Đăng ký",
      description: "Điền thông tin cá nhân và lịch sử sức khỏe",
      icon: "clipboard-outline",
      color: "#2196F3",
    },
    {
      id: 2,
      title: "Kiểm tra sức khỏe",
      description: "Đo huyết áp, cân nặng và kiểm tra sức khỏe tổng quát",
      icon: "fitness-outline",
      color: "#4CAF50",
    },
    {
      id: 3,
      title: "Xét nghiệm máu",
      description: "Kiểm tra nhóm máu và các chỉ số cần thiết",
      icon: "water-outline",
      color: "#FF9800",
    },
    {
      id: 4,
      title: "Hiến máu",
      description: "Quá trình hiến máu an toàn và nhanh chóng",
      icon: "heart-outline",
      color: "#E91E63",
    },
    {
      id: 5,
      title: "Nghỉ ngơi",
      description: "Thư giãn và bổ sung dinh dưỡng sau khi hiến máu",
      icon: "cafe-outline",
      color: "#9C27B0",
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Chiến dịch hiến máu tại Bệnh viện Chợ Rẫy",
      time: "2 giờ trước",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Tầm quan trọng của việc hiến máu định kỳ",
      time: "5 giờ trước",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.userIconContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                }}
                style={styles.userIcon}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Xin chào!</Text>
              <Text style={styles.userName}>{userData?.data.fullname}</Text>
            </View>

            <TouchableOpacity onPress={() => setShowNotifications(true)}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm máu, bệnh viện, khu vực..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.filterIcon}>
              <Ionicons name="options-outline" size={20} color="#E91E63" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Beautiful Video Title */}
        <View style={styles.videoTitleContainer}>
          <View style={styles.titleDecoration}>
            <View style={styles.heartIcon}>
              <Ionicons name="heart" size={16} color="#E91E63" />
            </View>
            <View style={styles.titleLine} />
            <View style={styles.heartIcon}>
              <Ionicons name="heart" size={16} color="#E91E63" />
            </View>
          </View>

          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>LUNARIST</Text>
            <Text style={styles.subTitle}>Blood Donation System</Text>
            <Text style={styles.motto}>💝 Mỗi giọt máu - Một sự sống 💝</Text>
          </View>

          <View style={styles.titleDecoration}>
            <View style={styles.heartIcon}>
              <Ionicons name="heart" size={16} color="#E91E63" />
            </View>
            <View style={styles.titleLine} />
            <View style={styles.heartIcon}>
              <Ionicons name="heart" size={16} color="#E91E63" />
            </View>
          </View>
        </View>

        {/* Video Banner */}
        <View style={styles.videoBanner}>
          <WebView
            style={styles.video}
            source={{
              uri: "https://www.youtube.com/embed/YHxdhI5ZrHc?autoplay=0&controls=1",
            }}
            allowsFullscreenVideo
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon} size={20} color="#E91E63" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Blood Donation Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.sectionTitle}>Quy trình hiến máu</Text>
          <Text style={styles.sectionSubtitle}>
            5 bước đơn giản để trở thành người hiến máu
          </Text>

          <View style={styles.stepsWrapper}>
            {donationSteps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepIconContainer,
                      { backgroundColor: step.color + "20" },
                    ]}
                  >
                    <Ionicons name={step.icon} size={24} color={step.color} />
                  </View>
                  {index < donationSteps.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepNumber}>Bước {step.id}</Text>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startDonationButton}>
            <Ionicons
              name="heart"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.startDonationText}>Bắt đầu hiến máu</Text>
          </TouchableOpacity>
        </View>

        {/* Main Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Dịch vụ chính</Text>
          <View style={styles.featuresGrid}>
            {mainFeatures.map((feature) => (
              <TouchableOpacity key={feature.id} style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: feature.bgColor },
                  ]}
                >
                  <Ionicons
                    name={feature.icon}
                    size={32}
                    color={feature.color}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity style={styles.emergencyBanner}>
          <View style={styles.emergencyIcon}>
            <Ionicons name="warning" size={24} color="#fff" />
          </View>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Cấp cứu máu</Text>
            <Text style={styles.emergencySubtitle}>
              Nhấn để gọi hotline 24/7
            </Text>
          </View>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>

        {/* News Section */}
        <View style={styles.newsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin tức mới nhất</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {newsItems.map((news) => (
            <TouchableOpacity key={news.id} style={styles.newsItem}>
              <Image source={{ uri: news.image }} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsTime}>{news.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      {showNotifications && (
        <View style={[StyleSheet.absoluteFill, { paddingTop: 20 }]}>
          <NotificationsScreen onClose={() => setShowNotifications(false)} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  notificationIcon: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -4,
    backgroundColor: "#E91E63",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
    color: "#333",
  },
  filterIcon: {
    padding: 5,
  },
  // Beautiful Video Title Styles
  videoTitleContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  titleDecoration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  heartIcon: {
    backgroundColor: "#fce4ec",
    borderRadius: 12,
    padding: 6,
  },
  titleLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E91E63",
    marginHorizontal: 12,
    borderRadius: 1,
  },
  mainTitleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E91E63",
    letterSpacing: 3,
    textShadowColor: "rgba(233, 30, 99, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 4,
    letterSpacing: 1,
  },
  motto: {
    fontSize: 14,
    color: "#E91E63",
    marginTop: 8,
    fontStyle: "italic",
    textAlign: "center",
  },
  videoBanner: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    height: 200,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    backgroundColor: "#fce4ec",
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  // Blood Donation Steps Styles
  stepsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  stepsWrapper: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepLeft: {
    alignItems: "center",
    marginRight: 15,
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginTop: -8,
  },
  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepHeader: {
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    color: "#E91E63",
    fontWeight: "600",
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  startDonationButton: {
    backgroundColor: "#E91E63",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  startDonationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    borderRadius: 25,
    padding: 15,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  featureSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  emergencyBanner: {
    backgroundColor: "#E91E63",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 10,
    marginRight: 15,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  emergencySubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  newsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "600",
  },
  newsItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 20,
  },
  newsTime: {
    fontSize: 12,
    color: "#666",
  },
  bottomSpacing: {
    height: 20,
  },
});
