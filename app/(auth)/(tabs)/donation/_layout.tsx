import { Stack } from 'expo-router';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
export default function DonateLayout() {
return (
    <HealthProvider>
        <Stack screenOptions={{ headerShown: false }} />
    </HealthProvider>
    );
}
