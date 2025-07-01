import { Stack } from 'expo-router';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import Toast from 'react-native-toast-message';
import { ReceiverProvider } from '@/hooks/Receiver/useReceiver';

export default function ReceiverLayout() {
return (
    <HealthProvider>
        <ReceiverProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                              <Toast />

        </ReceiverProvider>
    </HealthProvider>
    );
}
