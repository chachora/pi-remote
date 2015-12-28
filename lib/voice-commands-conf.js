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
        voiceCommands.push({
            "action": command.action,
            "button": command.name,
            "device_name": device   .device_name,
            "voice_command": command.voice_command
        })
    })
 });
};

var writeConf = function(){

};

readConf();

/**
 * Returns all voice commands.
 * @returns {Array}
 */
exports.getCommands = function(){
 return voiceCommands;
};

/**
 * Deletes command with particular index.
 * @param index
 */
exports.deleteCommand = function(index){
    voiceCommands.splice(index, 1);
    writeConf();
};

/**
 * Updates voice command text.
 * @param index
 * @param command
 */
exports.updateCommand = function(index, command){
    voiceCommands[index].voice_command = command;
    writeConf();
};