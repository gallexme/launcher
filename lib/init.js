const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');
const prompt = require('prompt');

module.exports = function(dir) {

    dir = path.resolve(dir);
    try {
        var stat = fs.statSync(dir);
        if (stat && !stat.isDirectory()) {
            console.error(`${dir} is not a directory!`);
            return;
        }
        try {
            stat = fs.statSync(path.resolve(dir, '.screepsrc'));
            if(stat) {
                console.error(`Existing .screepsrc found in this directory!`);
                return;
            }
        }
        catch(e) {}
    }
    catch (e) {
        if (e.code == 'ENOENT') {
            fs.mkdirSync(dir);
        }
        else {
            throw e;
        }
    }


    ncp(path.resolve(__dirname, '../init_dist'), dir, (err) => {
        if (err) {
            console.error("Error while creating world data:", err);
        }
        else {
            var configFilename = path.resolve(dir, '.screepsrc');
            var config = fs.readFileSync(configFilename, {encoding: 'utf8'});
            //config = config.replace(/{{STEAM_KEY}}/, results.steamApiKey);
            fs.writeFileSync(configFilename, config);
            fs.chmodSync(path.resolve(dir, 'node_modules/.hooks/install'), '755');
            fs.chmodSync(path.resolve(dir, 'node_modules/.hooks/uninstall'), '755');
            console.log(`Screeps world data created in "${dir}".\nRun "screeps start" to launch your server.`);
        }
    })
};
