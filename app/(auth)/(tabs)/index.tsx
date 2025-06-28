import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');

  const mainFeatures = [
    {
      id: 1,
      title: 'Nhận Máu',
      subtitle: 'Tìm kiếm máu cần thiết',
      icon: 'medical-outline',
      color: '#E91E63',
      bgColor: '#fce4ec',
    },
    {
      id: 2,
      title: 'Hiến Máu',
      subtitle: 'Đăng ký hiến máu',
      icon: 'heart-outline',
      color: '#2196F3',
      bgColor: '#e3f2fd',
    },
    {
      id: 3,
      title: 'Tìm Kiếm Gần Đây',
      subtitle: 'Máu gần khu vực của bạn',
      icon: 'location-outline',
      color: '#4CAF50',
      bgColor: '#e8f5e8',
    },
    {
      id: 4,
      title: 'Tin Tức',
      subtitle: 'Cập nhật thông tin mới',
      icon: 'newspaper-outline',
      color: '#FF9800',
      bgColor: '#fff3e0',
    },
  ];

  const quickStats = [
    { label: 'Yêu cầu hôm nay', value: '24', icon: 'trending-up' },
    { label: 'Người hiến máu', value: '1.2K', icon: 'people' },
    { label: 'Sinh mạng cứu sống', value: '856', icon: 'heart' },
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Chiến dịch hiến máu tại Bệnh viện Chợ Rẫy',
      time: '2 giờ trước',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    },
    {
      id: 2,
      title: 'Tầm quan trọng của việc hiến máu định kỳ',
      time: '5 giờ trước',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
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
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
                style={styles.userIcon}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Xin chào!</Text>
              <Text style={styles.userName}>Ayushman</Text>
            </View>
            
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
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

        {/* Video Banner */}
        {/* Blood Banner Title */}
        <View
          style={{
            borderWidth: 1,
            borderColor: '#C2185B',
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginHorizontal: 32,
            backgroundColor: '#fff0f6',
            alignSelf: 'center',
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#C2185B',
              textAlign: 'center',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              fontStyle: 'italic',
            }}
          >
            Donation Blood Systems LUNARIST 
          </Text>
        </View>

        <View style={styles.videoBanner}>
          <WebView
            style={styles.video}
            source={{ uri: 'https://www.youtube.com/embed/YHxdhI5ZrHc?autoplay=0&controls=1' }}
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

        {/* Main Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Dịch vụ chính</Text>
          <View style={styles.featuresGrid}>
            {mainFeatures.map((feature) => (
              <TouchableOpacity key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: feature.bgColor }]}>
                  <Ionicons name={feature.icon} size={32} color={feature.color} />
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
            <Text style={styles.emergencySubtitle}>Nhấn để gọi hotline 24/7</Text>
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
    </>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E91E63',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
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
  filterIcon: {
    padding: 5,
  },
  videoBanner: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  videoSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.8)',
    borderRadius: 30,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    backgroundColor: '#fce4ec',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emergencyBanner: {
    backgroundColor: '#E91E63',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
    marginRight: 15,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emergencySubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  newsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '600',
  },
  newsItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  newsTime: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 20,
  },
});