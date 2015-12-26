/**
 * Created by chachora on 12/26/15.
 */

var fs = require("fs");
var path = require("path");


const VOICE_COMMANDS_PATH = path.dirname(require.main.filename) + "/assets/voice_commands.json";

/**
 * Voice commands configuration object.
 * @type {Array}
 */
var voiceCommands = [];

/**
 * Read configuration from file system.
 */
var readConf = function(){
 var devices = JSON.parse(fs.readFileSync(VOICE_COMMANDS_PATH,"utf8"));

 devices.forEach(function(device){
    device.commands.forEach(function(command){
        voiceCommands.push({"voice_command": command.voice_command})
    })
 });
};

readConf();

exports.getVoiceCommands = function(){
 return voiceCommands;
};