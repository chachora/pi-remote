/**
 * Created by chachora on 12/23/15.
 */

var fs = require("fs");
var path = require("path");
var lircDevices = require("../lib/lirc-devices");
var voiceCommandsConf = require("../lib/voice-commands-conf.js");
var yandexSpeech = require("yandex-speech");

const SOUND_FILE_RELATIVE_PATH = "/data/sound.mp3";
const SOUND_FILE_PATH = path.dirname(require.main.filename) + SOUND_FILE_RELATIVE_PATH;

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
     * Controller for adding new voice command.
     */
    app.get("/commands/add/:command/:device/:button", function(req, res){
        var command = req.params["command"];
        var device = req.params["device"];
        var button = req.params["button"];
        voiceCommandsConf.addCommand(command,device,button);
        res.redirect("/commands")
    });

    /**
     * Controller for deleting voice commands.
     */
    app.get("/commands/delete/:index", function(req, res){
        var index = req.params["index"];
        voiceCommandsConf.deleteCommand(index);
        res.redirect("/commands")
    });

    /**
     * Controller for updating existing voice command.
     */
    app.get("/commands/update/:index/:command", function(req, res){
        var index = req.params["index"];
        var command = req.params["command"];
        voiceCommandsConf.updateCommand(index, command);
        res.redirect("/commands")
    });

    /**
     * Controller for json presentation of the voice commands list.
     */
    app.get("/commands/json", function(req, res){
        res.json(voiceCommandsConf.getCommands())
    });

    /**
     * Pronounce command with Yandex SpeechKit.
     */
    app.get("/commands/speech/:text", function(req, res){
        try {
            if (fs.existsSync(SOUND_FILE_PATH))
                fs.unlinkSync(SOUND_FILE_PATH);
            var text = req.params["text"];
            yandexSpeech.TTS({
                text: text,
                file: SOUND_FILE_PATH
            }, function () {
                var stat = fs.statSync(SOUND_FILE_PATH);

                res.writeHead(200, {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": stat.size
                });

                var stream = fs.createReadStream(SOUND_FILE_PATH);
                stream.pipe(res);
            })
        } catch (err){
            console.log(err.message);
        }
    })
};