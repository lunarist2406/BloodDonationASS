import { Stack } from 'expo-router';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import { DonateBloodProvider } from '@/hooks/Donate/useDonateBlood';
import Toast from 'react-native-toast-message';
import { BloodProvider } from '@/hooks/Blood/useBlood';

export default function DonateLayout() {
return (
    <HealthProvider>
        <DonateBloodProvider>
            <BloodProvider>
                                <Stack screenOptions={{ headerShown: false }} />
                              <Toast />
            </BloodProvider>
        </DonateBloodProvider>
    </HealthProvider>
    );
}
