import { AsyncStorage } from 'react-native';

export default class SaveAutoSyncCalendar {

    getAutoSyncCalendar = async () => {
        AsyncStorage.getItem('calendar').then((value) => {
            console.log("getAutoSyncCalendar : " + value);
            return value
        });
    }

    setAutoSyncCalendar(calendar) {
        return AsyncStorage.setItem('calendar', JSON.stringify(calendar))
            .then(json => console.log('success!'))
            .catch(error => console.log('error!'));
    }

}
