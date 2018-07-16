
var Authorization = {
    convert(empID, funcID, clientToken) {
        code = empID + "." + funcID + "." + clientToken
        // console.log("Authorization code ==> : ", code);
        let encodedString = btoa(code);
        // console.log("Authorization ==> : ", encodedString);
        let authorization = "Bearer " + encodedString
        // console.log("Authorization authorization ==> : ", authorization);
        return authorization
    }
};

module.exports = Authorization;