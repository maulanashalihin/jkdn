var CryptoJS = require("crypto-js");
const axios = require('axios');
  
const querystring = require('querystring');
 
const url = require('url');
const sig = require('../lib/sig.js');
const path  = require('path')
// console.log(sig)  
var CryptoJS = require("crypto-js");
 


var cache = new Map();


var token = [];
var js_url = '';

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

setInterval(() => {
    GetToken();
}, 1000 * 60 * 60);

GetToken();

function GetToken() {
    axios.get('https://www.youtube.com/watch?v=9ah6tH6-M2U', {
        headers: {
            'Accept-Language': 'id'
        }
    }).then(result => {

        var start1 = result.data.indexOf('PLAYER_JS_URL":"');

        var end1 = result.data.indexOf('\/base.js",',start1) + 8;

        var result1 = result.data.substring(start1+16, end1);

        var new_url = result1.replaceAll('\\', ''); 


        if (js_url != new_url) {
            js_url = new_url;
            
            sig.getTokens('https://www.youtube.com' + new_url, {}).then(response=>{
                token = response;
            }); 
        }



    })
}

 


function makeUrl(format) {
    if (format.signatureCipher) {
        format.signatureCipher = querystring.parse(format.signatureCipher);
        var ff = (sig.decipher(token, format.signatureCipher.s))
        decodedUrl = decodeURIComponent(format.signatureCipher.url)
        const parsedUrl = url.parse(decodedUrl, true);
        delete parsedUrl.search;
        let query = parsedUrl.query;
        query.ratebypass = 'yes';
        if (format.signatureCipher.sp) {
            query[format.signatureCipher.sp] = ff;
        } else {
            query.signature = ff;
        }

        parsedUrl.query = query;
        format.url = (url.format(parsedUrl))
        // console.log(format.url)


    }
}

module.exports = async (req, res) => {
  
    
    let chiperVideoId = req.query.videoId;
    var bytes  = CryptoJS.AES.decrypt(chiperVideoId, 'demokrasi mati khilafah berjaya');
    var videoId = bytes.toString(CryptoJS.enc.Utf8);
    
    if(videoId)
    {    
       
    
            axios.get('https://www.youtube.com/watch?v=' + videoId, {
                headers: {
                    'Accept-Language': 'id',
                }
            }).then(result => { 

                    setTimeout(()=>{
                        cache.delete(videoId);
                    },1000 * 10)

                    var source =result.data;
                    var  first = source.indexOf('ytInitialPlayerResponse = {'); 
                    var second = source.indexOf('};',first); 
                    var three = source.substring(first+26,second+1)   
                    var data = JSON.parse(three)

                    
                    // data.streamingData.adaptiveFormats.forEach(format => {
                    //     makeUrl(format)
                    // });
                    data.streamingData.formats.forEach(format => {
                        makeUrl(format)
                    });


                    let send = data.streamingData.formats;
                    cache.set(videoId, send);

                  
                    
                    res.send(send)


                },error=>{
                    res.send("error guys")
                })

       
    }else{
        res.send('[]')
    }
 

  };
