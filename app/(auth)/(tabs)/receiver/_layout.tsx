import { Stack } from 'expo-router';
import { HealthProvider } from '@/hooks/HealthInfor/useHealthContext';
import Toast from 'react-native-toast-message';
import { ReceiverProvider } from '@/hooks/Receiver/useReceiver';
import { BloodProvider } from '@/hooks/Blood/useBlood';

export default function ReceiverLayout() {
return (
    <HealthProvider>
        <ReceiverProvider>
            <BloodProvider>
                                    <Stack screenOptions={{ headerShown: false }} />
                              <Toast />
            </BloodProvider>


        </ReceiverProvider>
    </HealthProvider>
    );
}
