import { Stack } from 'expo-router';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import { DonateBloodProvider } from '@/hooks/Donate/useDonateBlood';
import Toast from 'react-native-toast-message';

export default function DonateLayout() {
return (
    <HealthProvider>
        <DonateBloodProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                              <Toast />

        </DonateBloodProvider>
    </HealthProvider>
    );
}
