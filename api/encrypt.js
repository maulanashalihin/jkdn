var CryptoJS = require("crypto-js");

module.exports = (req, res) => {
    var ciphertext = await CryptoJS.AES.encrypt(  req.query.videoId, 'demokrasi mati khilafah berjaya').toString();

    res.send({videoId : req.query.videoId,ciphertext}) 
  };