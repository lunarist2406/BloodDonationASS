import { BloodProvider } from '@/hooks/Blood/useBlood';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import { Stack } from 'expo-router';

export default function SettingLayout() {
return (
    <HealthProvider>
        <BloodProvider>
                    <Stack screenOptions={{ headerShown: false }} />
        </BloodProvider>
    </HealthProvider>
    );
}
