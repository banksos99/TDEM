import { AsyncStorage } from 'react-native';

export default class SavePIN {

    getPin = async () => {
        // return await AsyncStorage.getItem('pin');
        const value = await AsyncStorage.getItem('pin');
        console.log("SavePIN getPin ========> ", value)
        return value
    }

    setPin(PIN) {
        return AsyncStorage.setItem('pin', PIN)
            .then(json => console.log('success!'))
            .catch(error => console.log('error!'));
    }

}
