import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert , Image } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // iOS 14+ specific options to satisfy NotificationBehavior type
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Explore() {
  const [hours, setHours] = useState<string>('1'); // default: 1 hour
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        const req = await Notifications.requestPermissionsAsync();
        if (!req.granted) {
          Alert.alert('Permission required', 'Notifications permission is needed to schedule reminders.');
        }
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, []);

  const schedule = async () => {
    const h = Number(hours);
    if (!Number.isFinite(h) || h <= 0) {
      Alert.alert('Invalid value', 'Please enter a positive number of hours.');
      return;
    }
    const seconds = Math.max(1, Math.round(h * 3600));
    if (Platform.OS === 'ios' && seconds < 3600) {
      Alert.alert('Minimum on iOS', 'For repeating notifications on iOS, the interval must be at least 1 hour.');
      return;
    }

    try {
      // Cancel previous if any
      if (scheduledId) {
        await Notifications.cancelScheduledNotificationAsync(scheduledId);
        setScheduledId(null);
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Photo reminder',
          body: 'Review the images you just took in the Gallery tab.',
        },
        trigger: { seconds, repeats: true },
      });
      setScheduledId(id);
      const hText = (seconds / 3600).toFixed(2).replace(/\.00$/, '');
      Alert.alert('Scheduled', `You will be reminded every ${hText} hour${hText === '1' ? '' : 's'}.`);
    } catch (e: any) {
      console.warn('Failed to schedule notification', e);
      Alert.alert('Error', 'Failed to schedule notification. See console for details.');
    }
  };

  const cancel = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setScheduledId(null);
      Alert.alert('Canceled', 'All scheduled reminders have been canceled.');
    } catch (e) {
      console.warn('Failed to cancel notifications', e);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/wavy.png')} style={styles.design} />
      <Text style={[styles.title , styles.z]}>Photo Reminder Frequency</Text>
      <Text style={[styles.subtitle , styles.z]}>How often (in hours) should we <Text style={{ fontWeight: 'bold' , color: '#fff'}}>remind you to</Text>  check your gallery?</Text>

      <View style={[styles.inputRow , styles.z]}>
        <TextInput
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          placeholder="Hours (e.g. 1, 2, 0.5)"
          style={styles.input}
        />
        <Text style={styles.suffix}>hr</Text>
      </View>

      <TouchableOpacity style={[styles.primaryBtn , styles.z]} onPress={schedule}>
        <Text style={styles.btnText}>Save & Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.secondaryBtn , styles.z]} onPress={cancel}>
        <Text style={styles.btnText}>Cancel Reminders</Text>
      </TouchableOpacity>
      <Image source={require('../../assets/images/wavy.png')} style={styles.design2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:"55%",
    backgroundColor: '#ffde59',
    position:"relative",

  },
  z:{
    zIndex:2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  design2:{
    width:550,
    height:500,
    bottom:-250,
    left:-280,
    zIndex:1,
    transform:[{ rotate: "270deg"}],
    position: "absolute",
  },
  design:{
    position:"absolute",
    width:550,
    height:500,
    transform:[{ rotate :"90deg"}],
    top:-60,
    right:-250,
    zIndex:1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  suffix: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtn: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
