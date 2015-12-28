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
 voiceCommands = JSON.parse(fs.readFileSync(VOICE_COMMANDS_PATH,"utf8"));
};

var writeConf = function(){
    fs.writeFileSync(VOICE_COMMANDS_PATH, JSON.stringify(voiceCommands), "utf8");
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
 * Adds new voice command to the list
 * @param command
 * @param device
 * @param button
 */
exports.addCommand = function(command, device, button){
    voiceCommands.unshift({
        action: "/send"+device+'/'+button,
        button: button,
        device_name: device,
        voice_command: command
    });
    writeConf();
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