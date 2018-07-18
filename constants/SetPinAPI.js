import SharedPreference from "../SharedObject/SharedPreference";
import Authorization from '../SharedObject/Authorization'

export default async function getRestAPI(pin) {

    let code = {
        SUCCESS: "200",
        INVALID_API_KEY: "100",
        INVALID_AUTH_TOKEN: "101",
        INVALID_API_SIGNATURE: "102",
        FAILED: "400",
        FORM_VALIDATE_FAILED: "401",
        NODATA: "404",
        DUPLICATE: "409",
        TIME_OUT: "500",
        ERROR: "501",
        UPDATE_APPLICATION: "600",
        CUT_JSON: "700"
    }

    // let token = await Authorization.convert('1','1','')
    //TODO Bell

    return fetch(SharedPreference.SET_PIN_API, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: SharedPreference.TOKEN,
        },
        body: JSON.stringify({
            "type": "set",
            "client_pin": pin,
            "systemdn": "TMAP-EM"
        }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("callback success22222 : ", responseJson)
            let object
            if (responseJson.status == code.SUCCESS) {
                object = [code, {
                    code: responseJson.status,
                    data: responseJson.data
                }]
            } else {
                object = [code, {
                    code: responseJson.status,
                    data: responseJson.error
                }]
            }
            return object

        })
        .catch((error) => {
            console.log("callback error : ", error)
        });

}