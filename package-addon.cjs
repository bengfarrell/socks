const fs = require("fs");
const zip = new require('node-zip')();
const path = require('path');

const root = path.join(__dirname, 'blender/socks');

fs.readdir('blender/socks', function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        if (!fs.lstatSync(path.join(root, file)).isDirectory() ) {
            console.log('add file', file)
            zip.file(file, fs.readFileSync(path.join(root, file)));
        }
    });
    const data = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync('socks.zip', data, 'binary');
});
