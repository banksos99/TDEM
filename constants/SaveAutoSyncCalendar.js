import { AsyncStorage } from 'react-native';

export default class SaveAutoSyncCalendar {

    getAutoSyncCalendar = async () => {
        var value = await AsyncStorage.getItem("calendar");
        return JSON.parse(value)

    }

    setAutoSyncCalendar(calendar) {
        return AsyncStorage.setItem('calendar', JSON.stringify(calendar))
            .then(json => {
                //console.log('success!')
            })
            .catch(error => {
                //console.log('error!')
            });
    }

}
