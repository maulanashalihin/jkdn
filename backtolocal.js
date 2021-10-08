var path = require('path'), fs=require('fs');

var pkg = require("./package.json")

const version = "@"+pkg.version;

function fromDir(startPath,filter){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            console.log(filename)

            try {
                const data = fs.readFileSync(filename)
                //file written successfully
                 
                let result = data.toString().split('http://localhost:4343').join('https://cdn.jsdelivr.net/npm/jkdn-movie'+version+'/dist')

                 fs.writeFileSync(filename,result)
              } catch (err) {
                console.error(err)
              }

            // fs.readFile(filename, 'utf8' , (err, data) => {
            //     if (err) {
            //       console.error(err)
            //       return
            //     } 
            //     // console.log(data.indexOf('<link rel="stylesheet" href="./assets/css/main.css" />'))
            //     // let result = data.replace('<link rel="stylesheet" href="./assets/css/main.css" />','<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jkdnmovie@1.0.0/assets/css/main.css" />')
            //     // fs.writeFile(filename, result, err => {
            //     //     if (err) {
            //     //       console.error(err)
            //     //       return
            //     //     }
            //     //     console.log('success write')
            //     //     //file written successfully
            //     //   })
            // })
        };
    };
};

fromDir('./dist','.html');