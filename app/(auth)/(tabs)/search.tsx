"use client"

import { useEffect, useState } from "react"
import { StyleSheet, SafeAreaView, StatusBar, ScrollView } from "react-native"
import { useAuth } from "@/hooks/auth/useAuthContext"
import { useSearchByDistanceData } from "@/hooks/searchByDistance/useSearchByDistance"
import {
  useSearchByDistanceFilter,
  type BloodDonationData,
  type SearchByDistanceDTO,
} from "@/hooks/searchByDistance/useSearchByDistanceFilter"
import FilterInformationUI from "@/components/searchByDistance/FilterInformation"
import FormViewFilterMobile from "@/components/searchByDistance/FormViewFilter"

export default function MobileSearchApp() {
  const { user } = useAuth()
  const [distanceKm, setDistanceKm] = useState(10)
  const { data, loading, error, getData, setData } = useSearchByDistanceData()
  const [originalData, setOriginalData] = useState<BloodDonationData[]>([])
  const [selectedCenter, updateCenter] = useState<string | null>(null)

  const { filteredData, selectedTypes, updateTypes } = useSearchByDistanceFilter(data, {
    distanceKm,
    selectedCenter,
  })

  useEffect(() => {
    if (user) {
      const searchByDistance: SearchByDistanceDTO = {
        user_id: user.user_id,
        radiusInKm: distanceKm,
        typeToSearch: "",
      }
      getData(searchByDistance)
    }
  }, [user, distanceKm, getData])

  useEffect(() => {
    if (data.length > 0) {
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
