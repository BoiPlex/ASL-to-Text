import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Screen1() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 30 }}>
            <Text>Welcome!</Text>
            <Button title="Continue" onPress={() => router.push("/screens/screen4")} />
        </View>
    )

}