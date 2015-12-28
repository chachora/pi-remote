/**
 * Created by chachora on 12/23/15.
 */

var lircDevices = require("../lib/lirc-devices");
var voiceCommandsConf = require("../lib/voice-commands-conf.js");

module.exports = function (app){
    /**
     * Controller for voice commands list view.
     */
    app.get("/commands", function(req,res){
        var data = {
            commands_index: function(){
                return data.commands.indexOf(this)
            },
            commands: voiceCommandsConf.getCommands(),
            buttons: lircDevices.getButtons(),
            devices: lircDevices.getDevices()
    };

        res.render("voice_commands.html", data)
    });

    /**
     * Controller for deleting voice commands.
     */
    app.get("/commands/delete/:index", function(req, res){
        var index = req.params["index"];
        voiceCommandsConf.deleteCommand(index);
        res.redirect("/commands")
    });

    app.get("/commands/update/:index/:command", function(req, res){
        var index = req.params["index"];
        var command = req.params["command"];
        voiceCommandsConf.updateCommand(index, command);
        res.redirect("/commands")
    })
};