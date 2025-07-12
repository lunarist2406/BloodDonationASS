import { useEffect, useState } from "react"
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, ToastAndroid } from "react-native"
import { useAuth } from "@/hooks/auth/useAuthContext"
import { useSearchByDistanceData } from "@/hooks/searchByDistance/useSearchByDistance"
import {
  useSearchByDistanceFilter,
  type BloodDonationData,
  type SearchByDistanceDTO,
} from "@/hooks/searchByDistance/useSearchByDistanceFilter"
import FilterInformationUI from "@/components/searchByDistance/FilterInformation"
import FormViewFilterMobile from "@/components/searchByDistance/FormViewFilter"
import useSearchByDistanceService from "@/hooks/searchByDistance/useSearchByDistanceService"
import * as Location from "expo-location";
export default function MobileSearchApp() {
  const { user } = useAuth()
  const [distanceKm, setDistanceKm] = useState(10)
  const { data, loading, error, getData, setData } = useSearchByDistanceData()
  const [originalData, setOriginalData] = useState<BloodDonationData[]>([])
  const [selectedCenter, updateCenter] = useState<string | null>(null)
  const [useCurrentLocationCoords, setUseCurrentLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { searchByCurrentPosition, searchByCentralDistance } = useSearchByDistanceService(); 
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const { filteredData, selectedTypes, updateTypes } = useSearchByDistanceFilter(data, {
    distanceKm,
    selectedCenter,
  })

  useEffect(() => {
  if (!user) return;

  const fetchFilteredData = async () => {
    try {
      if (useCurrentLocation) {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await searchByCurrentPosition({
          lat: latitude,
          lng: longitude,
          radiusInKm: distanceKm,
        });

        if (response?.data) {
          setData(response.data);
        }
      } else if (selectedCenter) {
        const response = await searchByCentralDistance({
          central_id: selectedCenter,
          radiusInKm: distanceKm,
        });

        if (response?.data) {
          setData(response.data);
        }
      } else {
        if (originalData.length > 0) {
          setData(originalData); // ✅ dùng lại data cũ
        } else {
          // ❗ Gọi API lần đầu nếu originalData chưa có
          const dto: SearchByDistanceDTO = {
            user_id: user.user_id,
            radiusInKm: distanceKm,
            typeToSearch: "",
          };
          const res = await getData(dto);
          if (res?.data) {
            setOriginalData(res.data);
            setData(res.data);
          }
        }
      }
    } catch (err) {
      ToastAndroid.show("Có lỗi xảy ra khi tìm kiếm", ToastAndroid.SHORT);
    }
  };

  fetchFilteredData();
}, [user, distanceKm, useCurrentLocation, selectedCenter]);


  useEffect(() => {
  if (data.length > 0 && originalData.length === 0) {
    setOriginalData(data)
    }
  }, [data])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#EC4899" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FilterInformationUI
          selectedTypes={selectedTypes}
          distanceKm={distanceKm}
          selectedCenter={selectedCenter}
          onTypeChange={updateTypes}
          onDistanceChange={setDistanceKm}
          useCurrentLocation={useCurrentLocation}
          setUseCurrentLocation={setUseCurrentLocation}
          onUseCurrentLocationChange={setUseCurrentLocationCoords}
          onCenterChange={updateCenter}
          setData={setData}
          originalData={originalData}
        />
        <FormViewFilterMobile data={filteredData} distanceKm={distanceKm} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EC4899",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
})
