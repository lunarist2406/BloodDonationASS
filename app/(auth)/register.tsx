import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import { Alert } from "react-native";
import useProvinces, { District, Ward } from "@/hooks/location/useProvince";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import api from "@/config/axiosInstance";

export default function RegisterScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    city: "",
    district: "",
    ward: "",
    location: {
      ipAddress: "",
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { provinces, loading } = useProvinces();
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: data.ip,
          },
        }));
      } catch (error) {
        console.error("Không thể lấy IP address:", error);
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            ipAddress: "127.0.0.1",
          },
        }));
      }
    };
    fetchIP();
  }, []);

  const handleRegister = async () => {
    console.log("REGISTER");
    const {
      fullName,
      email,
      gender,
      phone,
      dob,
      password,
      confirmPassword,
      city,
      district,
      ward,
    } = formData;
    const selectedProvince = provinces.find((p) => p.code === city);
    console.log(selectedProvince?.name);
    const selectedDistrict = districts.find(
      (d) => d.code.toString() === district
    );
    const selectedWard = wards.find((w) => w.code.toString() === ward);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !gender ||
      !phone.trim() ||
      !dob.trim() ||
      !password ||
      !confirmPassword ||
      !selectedProvince?.name.trim() ||
      !selectedDistrict?.name.trim() ||
      !selectedWard?.name.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }
    // Check phone format
    const phoneRegex = /^(0)(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const isUnder18 =
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

    if (isUnder18) {
      Alert.alert("Lỗi", "Bạn phải đủ 18 tuổi để đăng ký.");
      return;
    }
    try {
      const finalFormData = {
        email: email.trim(),
        password,
        fullname: fullName.trim(),
        phone: phone.trim(),
        dob,
        gender,
        location: {
          ipAddress: formData.location.ipAddress,
          city: selectedProvince?.name || "",
          district: selectedDistrict?.name || "",
          ward: selectedWard?.name || "",
        },
      };
      console.log("finale", finalFormData);
      await api.post("/api/v1/auth/register", finalFormData);
      Alert.alert(
  "Đăng ký thành công!",
  "Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
  [
    {
      text: "OK",
      onPress: () => {
        router.push({
          pathname: "/(auth)/verify-notice",
          params: {
            email: finalFormData.email,
            message: "Vui lòng kiểm tra email để hoàn tất quá trình đăng ký.",
          },
        });
      },
    },
  ],
  { cancelable: false }
);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đăng ký thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleProvinceChange = (provinceCode: string) => {
    const selectedProvince = provinces.find((p) => p.code === provinceCode);
    setFormData((prev) => ({
      ...prev,
      city: provinceCode,
      district: "",
      ward: "",
    }));
    setDistricts(selectedProvince?.districts || []);
  };

  const handleDistrictChange = (districtCode: string) => {
    const selectedDistrict = districts.find(
      (d) => d.code.toString() === districtCode
    );

    setFormData((prev) => ({
      ...prev,
      district: districtCode,
      ward: "",
    }));

    setWards(selectedDistrict?.wards || []);
  };

  const handleWardChange = (wardCode: string) => {
    setFormData((prev) => ({ ...prev, ward: wardCode }));
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>REGISTER</Text>
            <Text style={styles.subtitle}>
              Create your account to get started
            </Text>
          </View>
        </View>
        <View style={styles.scrollContent}>
          <View style={styles.grid}>
            <InputField
              icon="person"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChangeText={(v: string) => handleChange("fullName", v)}
              fullWidth
            />
            <InputField
              icon="mail"
              placeholder="Email"
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              fullWidth
            />
            <SelectField
              icon="male-female"
              selectedValue={formData.gender}
              onValueChange={(v) => handleChange("gender", v)}
              options={[
                { label: "Nam", value: "Male" },
                { label: "Nữ", value: "Female" },
              ]}
              placeholder="Giới tính"
            />
            <InputField
              icon="call"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChangeText={(v: string) => handleChange("phone", v)}
            />
            <InputField
              icon="lock-closed"
              placeholder="Mật khẩu"
              secureTextEntry={!showPassword}
              showToggle
              onToggleSecureEntry={() => setShowPassword((prev) => !prev)}
              value={formData.password}
              onChangeText={(v) => handleChange("password", v)}
              fullWidth
            />

            <InputField
              icon="lock-closed"
              placeholder="Xác nhận mật khẩu"
              secureTextEntry={!showConfirmPassword}
              showToggle
              onToggleSecureEntry={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              value={formData.confirmPassword}
              onChangeText={(v) => handleChange("confirmPassword", v)}
              fullWidth
            />

            {/* <InputField
              icon="calendar"
              placeholder="Ngày sinh"
              value={formData.dob}
              onChangeText={(v: string) => handleChange("dob", v)}
            /> */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.datePickerField,
                { width: (SCREEN_WIDTH - 60) / 2 },
              ]}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color="#DC143C"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: formData.dob ? "#333" : "#999" }}>
                  {formData.dob ? formData.dob : "Ngày sinh"}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dob ? new Date(formData.dob) : new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === "set" && selectedDate) {
                    const formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0];
                    handleChange("dob", formattedDate);
                  }
                }}
              />
            )}

            <SelectField
              icon="location"
              selectedValue={formData.city}
              onValueChange={handleProvinceChange}
              options={provinces.map((p) => ({
                label: p.name,
                value: p.code,
              }))}
              placeholder="Tỉnh/Thành phố"
            />

            <SelectField
              icon="business"
              selectedValue={formData.district}
              onValueChange={handleDistrictChange}
              options={districts.map((d) => ({
                label: d.name,
                value: d.code.toString(),
              }))}
              placeholder="Quận/Huyện"
              disabled={!formData.city}
            />

            <SelectField
              icon="pin"
              selectedValue={formData.ward}
              onValueChange={handleWardChange}
              options={wards.map((w) => ({
                label: w.name,
                value: w.code.toString(),
              }))}
              placeholder="Phường/Xã"
              disabled={!formData.district}
            />
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>

          <View style={styles.loginRedirect}>
            <Text style={{ color: "#666" }}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginText}>ĐĂNG NHẬP NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: "#DC143C",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },

  titleSection: {
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
    textAlign: "center",
  },
  scrollContent: {
    padding: 20,
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#DC143C",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#DC143C",
    fontWeight: "600",
    fontSize: 14,
  },
  datePickerField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  continueBtn: {
    backgroundColor: "#DC143C", // Darker red
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#DC143C", // Darker red
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
});
