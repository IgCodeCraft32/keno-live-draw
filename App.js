/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  AppState,
  ScrollView,
  StyleSheet,
} from "react-native";
import HomeScreen from "./src/screens/MenuScreen";
import Header from "./src/components/Header";
import BackgroundService from "react-native-background-actions";

import PushNotificationIOS from "@react-native-community/push-notification-ios";

import {
  notificationId,
  backgroundFetchOptions,
  sleep,
  fetchData,
} from "./src/global";

function App() {
  const [jurisdiction, setJurisdiction] = useState("NSW");
  const [limit, setLimit] = useState(20);
  const [notificationEnable, setNotificationEnable] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  // Background task function
  const veryIntensiveTask = async (taskData) => {
    const { delay } = taskData;
    while (BackgroundService.isRunning()) {

      const { timeoutDuration, datas } = await fetchData(jurisdiction);
      if (datas.length > 0) {
        const flatedDrawArray = datas
          .map((item) => item?.draw)
          .slice(0, limit - 1)
          .flat();
        const uniqueElements = new Set(flatedDrawArray);
        const result = Array.from({ length: 80 }, (_, idx) => idx + 1).filter(
          (element) => !uniqueElements.has(element)
        );
       
        if (notificationEnable && datas.length >= limit && result.length > 0) {
          const newNotification = {
            id: notificationId,
            title: "KenoLiveDraw",
            subtitle: `Available ${result.length} balls in ${
              datas[0]?.["game-number"]
            }~${datas[limit - 1]?.["game-number"]}`,
            body: `${JSON.stringify(result)}`,
            isSilent: true,
          };
          
          PushNotificationIOS.requestPermissions();
          PushNotificationIOS.getDeliveredNotifications;
          PushNotificationIOS.addNotificationRequest(newNotification);
        }
      }
      await sleep(timeoutDuration);
    }
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // console.log("App has come to the foreground!");
        await stopBackgroundTask();
      } else if (nextAppState === "background") {
        // console.log("App has gone to the background!");
        await startBackgroundTask();
      }
      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      // Cleanup the event listener on unmount
      subscription.remove();
    };
  }, [appState]);

  const startBackgroundTask = async () => {
    try {
      // console.log("Starting background task...");
      await BackgroundService.start(veryIntensiveTask, backgroundFetchOptions);
    } catch (error) {
      console.log("Error starting background task:", error);
    }
  };

  const stopBackgroundTask = async () => {
    try {
      // console.log("Stopping background task...");
      await BackgroundService.stop();
    } catch (error) {
      console.log("Error stopping background task:", error);
    }
  };

  const [lastNotification, setLastNotification] = useState(null);
  const scheduleNotification = (title, subtitle, body) => {
    if (
      body === lastNotification?.body &&
      subtitle === lastNotification?.subtitle
    )
      return;
    const newNotification = {
      id: notificationId,
      title,
      subtitle,
      body,
      isSilent: true,
    };
    setLastNotification(newNotification);

    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.getDeliveredNotifications;
    PushNotificationIOS.addNotificationRequest(newNotification);
  };

  const removeNitifications = () => {
    PushNotificationIOS.removePendingNotificationRequests([notificationId]);
    PushNotificationIOS.removeDeliveredNotifications([notificationId]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HomeScreen
          jurisdiction={jurisdiction}
          setJurisdiction={setJurisdiction}
          limit={limit}
          setLimit={setLimit}
          lastNotification={lastNotification}
          scheduleNotification={scheduleNotification}
          removeNitifications={removeNitifications}
          notificationEnable={notificationEnable}
          setNotificationEnable={setNotificationEnable}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
