import type { BloodDonationData } from "@/hooks/searchByDistance/useSearchByDistanceFilter"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface FormViewFilterProps {
  data: BloodDonationData[]
  distanceKm: number
}

const FormViewFilterMobile = ({ data, distanceKm }: FormViewFilterProps) => {
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "hien":
        return { label: "Hiến máu", icon: "heart", color: "#EC4899" }
      case "can":
        return { label: "Cần máu", icon: "medical", color: "#EF4444" }
      default:
        return { label: "Đã hiến và cần máu", icon: "refresh", color: "#8B5CF6" }
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Tìm Kiếm</Text>
        <Text style={styles.headerSubtitle}>Kết quả trong bán kính {distanceKm} km</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Ionicons name="list" size={24} color="#EC4899" />
          </View>
          <Text style={styles.statsNumber}>{data.length}</Text>
          <Text style={styles.statsLabel}>Kết quả tìm kiếm</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Ionicons name="radio-button-on" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statsNumber}>{distanceKm} km</Text>
          <Text style={styles.statsLabel}>Bán kính tìm kiếm</Text>
        </View>
      </View>

      {/* Results List */}
      <View style={styles.resultsContainer}>
        {data.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptyDescription}>Thử điều chỉnh bộ lọc hoặc tăng bán kính tìm kiếm</Text>
          </View>
        ) : (
          data.map((item, index) => {
            const typeInfo = getTypeInfo(item.type)
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.resultCard, index === 0 && styles.firstCard]}
                activeOpacity={0.7}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.resultNumber}>
                    <Text style={styles.resultNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <View style={styles.resultMeta}>
                      <View style={[styles.typeTag, { backgroundColor: typeInfo.color + "20" }]}>
                        <Ionicons name={typeInfo.icon as any} size={14} color={typeInfo.color} />
                        <Text style={[styles.typeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location" size={16} color="#6B7280" />
                    <Text style={styles.distanceText}>{item.distance} km</Text>
                  </View>
                </View>

                <View style={styles.resultFooter}>
                  <View style={styles.resultDetail}>
                    <Ionicons name="person" size={14} color="#6B7280" />
                    <Text style={styles.resultDetailText}>Vai trò: {typeInfo.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#E91E63",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  resultsContainer: {
    marginHorizontal: 16,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  firstCard: {
    borderWidth: 2,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF7FF",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  resultNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resultNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  resultDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultDetailText: {
    fontSize: 12,
    color: "#6B7280",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: "#EC4899",
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 20,
  },
})

export default FormViewFilterMobile
