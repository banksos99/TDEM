
var Base64Encode = {
    convert(empID, funcID, clientToken) {
        code = empID + "." + funcID + "." + clientToken
        var encodedString = btoa(code);
        // console.log("encodedString : ", encodedString); 
        return encodedString
    }
};

module.exports = Base64Encode;