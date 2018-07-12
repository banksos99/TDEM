import SharedPreference from "../SharedObject/SharedPreference";

export default async function getRestAPI(PIN) {

    let code = {
        SUCCESS: "200",
        INVALID_API_KEY: "100",
        INVALID_AUTH_TOKEN: "101",
        INVALID_API_SIGNATURE: "102",
        FAILED: "400",
        FORM_VALIDATE_FAILED: "401",
        NODATA: "404",
        TIME_OUT: "500",
        ERROR: "501",
        UPDATE_APPLICATION: "600",
        CUT_JSON: "700"
    }


    return fetch(SharedPreference.REGISTER_API, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "type": "set",
            "client_pin": PIN,
            "systemdn": SharedPreference.company
        }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            
            console.log("RegisterWithPINAPI ==> callback success : ", responseJson)
            let object
            if (responseJson.status == code.SUCCESS) {
                SharedPreference.profileObject = responseJson.data
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