import SharedPreference from "../SharedObject/SharedPreference";

export default async function getRestAPI(url) {

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

    console.log("url : ",url)

    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: SharedPreference.TOKEN,
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("callback success : ", responseJson.status)
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
            return [code, {
                code: code.ERROR,
                data: error
            }]
        });
}