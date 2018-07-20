var aesjs = require('aes-js');
var sha512 = require('js-sha512').sha512;
var base64 = require('base-64');

import SharedPreference from "./../SharedObject/SharedPreference"


var Decrypt = {

    decrypt(enc64) {
        console.log("enc64 : ", enc64)
        if (enc64) {

            try {

                console.log("start secretKey : ", SharedPreference.profileObject.client_secret)
                let secretkey = sha512.digest(SharedPreference.profileObject.client_secret).slice(0, 16);
                console.log("se cretKey : ", secretkey)

                let enc = base64.decode(base64.decode(enc64));
                console.log("enc : ")

                var target = [];
                for (let i = 0; i < enc.length; i++) {
                    target.push(enc.charCodeAt(i))
                }

                var aesEcb = new aesjs.ModeOfOperation.ecb(secretkey);
                console.log("aesEcb : ")

                var decryptedBytes = aesEcb.decrypt(target);
                console.log("decryptedBytes : ")

                var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
                console.log("decryptedText : ")

                var result = decryptedText.split('.')[0];
                console.log("result : ",result)
                console.log("result 64  : ", base64.decode(result))
                let numberstr = base64.decode(result).split('.');
                console.log("numberstr : ")

                console.log("2result : ")

                let aa = parseInt(numberstr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + numberstr[1];
                // let bb =  base64.decode(result);
                console.log("3result : ", aa)

                return aa
            } catch (error) {
                return ''
            }

        } else {
            return '';
        }

    }
};

module.exports = Decrypt;