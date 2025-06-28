import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/auth/useAuth';
import { router } from 'expo-router';

export default function Setting() {
    const {logout} = useAuth();
        const handleLogoutConfirmed = async () => {
        await logout();
        console.log('Logged out');
        router.push("/(auth)/login")
        };

        const handleLogout = () => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất không?', [
            { text: 'Huỷ', style: 'cancel' },
            {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: handleLogoutConfirmed, // ✅ dùng hàm đã tách ra, không cần `async () =>`
            },
        ]);
        };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="#555" />
        <Text style={styles.title}>Cài đặt</Text>
      </ThemedView>

      <TouchableOpacity style={styles.item}>
        <Ionicons name="person-outline" size={24} color="#555" />
        <Text style={styles.label}>Tài khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Ionicons name="time-outline" size={24} color="#555" />
        <Text style={styles.label}>Lịch sử hiến/nhận máu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Ionicons name="heart-outline" size={24} color="#555" />
        <Text style={styles.label}>Thông tin sức khỏe</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.logout]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#d9534f" />
        <Text style={[styles.label, { color: '#d9534f' }]}>Đăng xuất</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logout: {
    marginTop: 32,
    borderBottomWidth: 0,
  },
});
