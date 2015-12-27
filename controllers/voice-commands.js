/**
 * Created by chachora on 12/23/15.
 */

var lircDevices = require("../lib/lirc-devices");
var voiceCommandsConf = require("../lib/voice-commands-conf.js");


exports.view = function(req,res){
        res.render("voice_commands.html", {
                commands: voiceCommandsConf.getVoiceCommands(),
                buttons: lircDevices.getButtons(),
                devices: lircDevices.getDevices()
        });
};