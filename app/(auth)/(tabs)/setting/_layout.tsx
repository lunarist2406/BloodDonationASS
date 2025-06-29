import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import { Stack } from 'expo-router';

export default function SettingLayout() {
return (
    <HealthProvider>
        <Stack screenOptions={{ headerShown: false }} />
    </HealthProvider>
    );
}
