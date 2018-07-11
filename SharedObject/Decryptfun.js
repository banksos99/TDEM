var aesjs = require('aes-js');
var sha512 = require('js-sha512').sha512;
var base64 = require('base-64');

var Decrypt = {

    decrypt(enc64) {

        if (enc64) {

            try {

                let secretkey = sha512.digest('7612cb8d83619c709145129f111f56523b74f8dba6bcf686660b31a4f5ef26043b02ba9f0bec3a6ae212d24fd16ec33d74f55b3aa4e803d7664a4a6e565ee042').slice(0, 16);

                let enc = base64.decode(base64.decode(enc64));

                var target = [];
                for (let i = 0; i < enc.length; i++) {

                    target.push(enc.charCodeAt(i))

                }
                // secretkey = [-78, -3, -98, -31, 22, -2, 6, -65, 66, 35, -29, 36, -118, 53, 33, -60];

                var aesEcb = new aesjs.ModeOfOperation.ecb(secretkey);

                var decryptedBytes = aesEcb.decrypt(target);
                // // Convert our bytes back into text
                var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

                var result = decryptedText.split('.')[0];

                let numberstr = base64.decode(result).split('.');

                return parseInt(numberstr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + numberstr[1];
                // return base64.decode(result);

            } catch (error) {
                return ''
            }

        } else {
            return '';
        }

    }
};

module.exports = Decrypt;