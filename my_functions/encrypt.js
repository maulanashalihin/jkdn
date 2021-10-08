var CryptoJS = require("crypto-js");
exports.handler = async function(event, context) {
    // your server-side functionality
  

    var ciphertext = await CryptoJS.AES.encrypt(  event.queryStringParameters.videoId, 'demokrasi mati khilafah berjaya').toString();

    return {
        statusCode: 200,
        body: JSON.stringify({videoId: ciphertext})
    };

}