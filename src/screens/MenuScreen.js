import React, { useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch, Dimensions} from 'react-native';

import useFetchData from '../hooks/useFetchData';
import NumberText from '../components/NumberText';
import RenderItem from '../components/RenderItem';
import RippleButton from '../animation/RippleButton';
import AnimatedInput from '../animation/AnimatedInput';
import Loader from '../components/Loader';

import PushNotificationIOS from '@react-native-community/push-notification-ios';

const notificationId = 'keno-live-draw-alert'

function MenuScreen() {
  const number_of_games = 50;
  const [limit, setLimit] = useState(20);
  const [inputValue, setInputValue] = useState('20');
  const [inputError, setInputError] = useState('');

  const handleFilter = () => {
    const numberValue = parseFloat(inputValue);

    if (
      isNaN(numberValue) ||
      numberValue < 0 ||
      numberValue > number_of_games
    ) {
      setInputError(`Enter a valid number (0 - ${number_of_games})`);
    } else {
      setLimit(numberValue);
      setInputError('');
    }
  };

  const {datas, error: fetchingError, fetchData, cancelModal} = useFetchData();
    
  const [lastNotification, setLastNotification] = useState(null)
  const scheduleNotification =
    (title, subtitle, body) => {
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
      PushNotificationIOS.getDeliveredNotifications
      PushNotificationIOS.addNotificationRequest(newNotification);
    }


  const [filterDrawArray, setFilterDrawArray] =  useState([])
  useEffect(()=>{
    const flatedDrawArray = datas
      .map((item) => item?.draw)
      .slice(0, limit - 1)
      .flat();

    const uniqueElements = new Set(flatedDrawArray);
    const result = Array.from({ length: 80 }, (_, idx) => idx + 1).filter(
      (element) => !uniqueElements.has(element)
    );
    if(notificationEnable && datas.length >= limit && result.length > 0){
      scheduleNotification(
        "KenoLiveDraw",
        `Available ${result.length} balls in ${datas[0]?.["game-number"]}~${
          datas[limit - 1]?.["game-number"]
        }`,
        `${JSON.stringify(result)}`
      );
    }
    setFilterDrawArray(result);
  }, [limit, datas, notificationEnable, lastNotification]);

  const [notificationEnable, setNotificationEnable] = useState(true);

  const toggleSwitch = () => {
    if(notificationEnable) removeNitifications();
    setNotificationEnable((previousState) => !previousState);
  };
  
  const removeNitifications = ()=>{
    PushNotificationIOS.removePendingNotificationRequests([notificationId]);
    PushNotificationIOS.removeDeliveredNotifications([notificationId]);
  }

  useEffect(()=>{
    if(!notificationEnable) removeNitifications();
    return ()=>{
      if(!notificationEnable) removeNitifications();
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.notification_form}>
        <Text style={styles.notification_text}>Notification: </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#006bb5' }}
          thumbColor={notificationEnable ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={notificationEnable}
        />
      </View>
      <View style={styles.form}>
        <AnimatedInput
          style={styles.textInput}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder=""
          keyboardType="numeric"
          onSubmitEditing={handleFilter}
          error={inputError}
          setError
        />

        <RippleButton
          title="Filter"
          style={styles.filterButton}
          onPress={handleFilter}
        />
      </View>
      <View style={styles.filteredNumbers}>
        <Text style={styles.filterLabel}>Result: </Text>
        {filterDrawArray.length > 0 ? (
          filterDrawArray.map((item, idx, arr) => (
            <NumberText
              key={item}
              value={item}
              isLast={idx === arr.length - 1 ? arr.length : 0}
            />
          ))
        ) : (
          <Text style={styles.nodataText}>Nothing</Text>
        )}
      </View>

      <View style={[styles.flatList, {marginBottom: 12}]}>
        <Text style={styles.faltListTitle}>
          Live Draw Datas: {datas[0] && datas[0]['game-number']}~
          {datas.at(-1) && datas.at(-1)['game-number']}
        </Text>
        {datas.length > 0 ? (
          datas.map((item, index) => (
            <RenderItem key={'row-' + index} item={item} />
          ))
        ) : (
          <Loader />
        )}
      </View>
      {fetchingError && (
        <View style={styles.coverScreen}>
          <View style={styles.errorAlert}>
            <Text style={styles.errorText}>{fetchingError}</Text>
            <View style={styles.buttons}>
              <RippleButton
                title="Cancel"
                style={styles.refreshButton}
                onPress={fetchData}
                color={'dark-red'}
                colorfulBackground={false}
              />
              <RippleButton
                title="Refresh"
                style={styles.refreshButton}
                onPress={cancelModal}
                color={'dark-red'}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const {width} = Dimensions.get('window');
const fontSize = width * 0.04;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffff7',
    display: 'flex',
    width: width,
  },
  notification_form: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  notification_text: {
    fontSize: 16,
    padding: 4,
    fontWeight: 'bold',
    color: '#107FBE',
  },
  form: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 36,
  },
  filterButton: {
    minHeight: 48,
    marginLeft: 6,
    width: 120,
  },
  filteredNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 12,
    marginHorizontal: 6,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#9CB1B6',
    borderRadius: fontSize,
    backgroundColor: '#EEFBF8',
  },
  filterLabel: {
    fontSize: 16,
    width: '100%',
    padding: 4,
    fontWeight: 'bold',
    color: '#107FBE',
  },
  nodataText: {
    width: '100%',
    paddingVertical: 12,
    fontSize: 24,
    textAlign: 'center',
    color: '#9CB1B6',
  },
  flatList: {
    marginVertical: 12,
  },
  faltListTitle: {
    width: width,
    textAlign: 'center',
    marginTop: 36,
    marginBottom: 8,
    fontSize: 24,
    color: '#006bb5',
  },
  coverScreen: {
    position: 'absolute',
    width: width * 0.9,
    height: 120,
    top: 12,
    left: (width - 350) / 2,
    backgroundColor: '#f0c4c0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c5202b',
  },
  errorAlert: {
    fontSize: 24,
    color: '#c5202b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    width: '100%',
    textAlign: 'center',
    color: '#c5202b',
    fontSize: 14,
    lineHeight: 20,
  },
  buttons: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    minHeight: 40,
    marginLeft: 12,
    minWidth: 80,
  },
});
export default MenuScreen;
