/**
 * Created by chachora on 12/23/15.
 */

var voiceCommandsConf = require("../lib/voice-commands-conf.js");

exports.view = function(req,res){
        res.render("voice_commands.html", {
                commands: voiceCommandsConf.getVoiceCommands()
        });
};