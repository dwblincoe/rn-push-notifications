import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: true,
    }),
});

export default function App() {
    useEffect(() => {
        //Fires when the notification is sent
        const subscription1 = Notifications.addNotificationReceivedListener(
            (notification) => {
                const username = notification.request.content.data.username;
                console.log("NOTIFICATION SENT", username);
            }
        );

        const subscription2 =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const username =
                        response.notification.request.content.data.username;

                    console.log("USER CLICKED NOTIFICATION", username);
                }
            );

        return () => {
            subscription1.remove();
            subscription2.remove();
        };
    }, []);
    //Check to see if permissions were given to allow notifications
    async function allowNotificationsAsync() {
        const settings = await Notifications.getPermissionsAsync();

        return (
            settings.granted ||
            settings.ios?.status ===
                Notifications.IosAuthorizationStatus.PROVISIONAL
        );
    }

    //Prompt the user to allow notifications on their device
    async function requestPermissionsAsync() {
        return await Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: false,
                allowAnnouncements: true,
            },
        });
    }
    async function handleScheduleNotification() {
        const hasPushNotificationPermissionGranted =
            await allowNotificationsAsync();

        if (!hasPushNotificationPermissionGranted) {
            await requestPermissionsAsync();
        }

        Notifications.scheduleNotificationAsync({
            content: {
                title: "My first local notification",
                body: "This is the body of the notification.",
                data: { username: "Drew" },
            },
            trigger: {
                seconds: 5,
            },
        });
    }

    return (
        <View style={styles.container}>
            <Button
                title="Schedule Notification"
                onPress={handleScheduleNotification}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
