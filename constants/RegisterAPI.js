import SharedPreference from "../SharedObject/SharedPreference";

export default async function getRestAPI(username, password) {

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

    console.log("getRestAPI ===> username : ", username, " ,  password :", password)

    return fetch(SharedPreference.REGISTER_API, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grant_type: "register",
            systemdn: "TDEM",
            username: username,
            password: password,
            device_model: "pI-x-phone",
            device_brand: "Iphone Inc",
            device_os: "ios",
            device_os_version: "11.4",
            firebase_token: "champy123",
            app_version: "1ebu83fg"
        }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("callback 111111success : ", responseJson)
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