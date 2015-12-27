/**
 * Dictionary of devices and their buttons
 * @type {Object}
 */

var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var devices = {};

/**
 * Generates function to get devices' buttons from irsend command
 * @param  {String} deviceName name of device
 * @return {Function}            exec callback
 */
var getCommandsForDevice = function(deviceName) {
    /**
     * Get Device's Button from irsend command
     * @param  {String} error  Error from running command
     * @param  {String} stdout std out
     * @param  {String} stderr std err
     * @return {None}
     */
    return function(error, stdout, stderr) {
        var lines = stderr.split("\n");
        for(var lineIndex in lines) {
            var line = lines[lineIndex];
            var parts = line.split(" ");
            if(parts.length>2) {
                var keyName = parts[2];
                devices[deviceName].push(keyName);
                console.log(deviceName + " found key: "+keyName);
            }
        }
    }
};

/**
 * Get devices from irsend command
 * @param cb Callback
 */
var updateDevices = function (cb){
    // Clear devices list
    devices = {};

    // Get all device information
    exec("irsend list \"\" \"\"", function (error, stdout, stderr) {
        if(error) {
            console.log("irsend not available.");
            return;
        }
        var lines = stderr.split("\n");
        for(var lineIndex in lines) {
            var line = lines[lineIndex];
            var parts = line.split(" ");
            if(parts.length>1) {
                var deviceName = parts[1];
                console.log("device found: "+deviceName.trim());
                devices[deviceName] = [];
                exec("irsend list \""+deviceName+"\" \"\"", getCommandsForDevice(deviceName));
            }
        }
        cb();
    });
};

// Initializes devices array.
updateDevices(function () {});

/**
 * Rewrites /etc/lirc/lircd.conf file and restarts LIRC daemon.
 * @param {String} conf Content of the lircd.conf file
 */
exports.updateConf = function(conf, cb)
{
    try{
        var options = {timeout: 10000};
        // Stop LIRC daemon
        execSync("sudo /etc/init.d/lirc stop", options);

        // Save lircd.conf file
        fs.writeFileSync("/etc/lirc/lircd.conf", conf);

        // Start LIRC daemon
        execSync("sudo /etc/init.d/lirc start", options);

        updateDevices(cb);
    } catch(err){
        console.log(err);
    }
};

exports.sendCommand = function(deviceName, key, cb){
    // Make sure that the user has requested a valid device
    if(!devices.hasOwnProperty(deviceName)) {
        cb("invalid device: " +deviceName);
        return;
    }

    // Make sure that the user has requested a valid key/button
    var device = devices[deviceName];
    var deviceKeyFound = false;
    for(var i = 0; i < device.length; i++) {
        if(device[i] === key) {
            deviceKeyFound = true;
            break;
        }
    }
    if(!deviceKeyFound) {
        cb("invalid key number: "+key);
        return;
    }

    // send command to irsend
    var command = "irsend SEND_ONCE "+deviceName+" "+key;
    exec(command, function(error, stdout, stderr){
        if(error)
            cb("Error sending command");
        else
            cb("Successfully sent command");
    });
};

exports.getCurrentDevice = function(){
    // Returns name of the first property of devices array
    var device = Object.keys(devices)[0];
    if (!device)
        return "none";
    else
        return device;
};

/**
 * Returns available devices list.
 * @returns {[]}
 */
exports.getDevices = function(){
    return Object.keys(devices);
};

/**
 * Returns list of all possible buttons names.
 * Can be obtained by irrecord –list-namespace.
 * @returns {string[]}
 */
exports.getButtons = function(){
    return ["KEY_0","KEY_102ND","KEY_1","KEY_2","KEY_3","KEY_4","KEY_5","KEY_6","KEY_7","KEY_8","KEY_9","KEY_A","KEY_AB","KEY_AGAIN","KEY_ALTERASE","KEY_ANGLE","KEY_APOSTROPHE","KEY_ARCHIVE","KEY_AUDIO","KEY_AUX","KEY_B","KEY_BACK","KEY_BACKSLASH","KEY_BACKSPACE","KEY_BASSBOOST","KEY_BATTERY","KEY_BLUE","KEY_BOOKMARKS","KEY_BREAK","KEY_BRIGHTNESSDOWN","KEY_BRIGHTNESSUP","KEY_BRL_DOT1","KEY_BRL_DOT2","KEY_BRL_DOT3","KEY_BRL_DOT4","KEY_BRL_DOT5","KEY_BRL_DOT6","KEY_BRL_DOT7","KEY_BRL_DOT8","KEY_C","KEY_CALC","KEY_CALENDAR","KEY_CAMERA","KEY_CANCEL","KEY_CAPSLOCK","KEY_CD","KEY_CHANNEL","KEY_CHANNELDOWN","KEY_CHANNELUP","KEY_CHAT","KEY_CLEAR","KEY_CLOSE","KEY_CLOSECD","KEY_COFFEE","KEY_COMMA","KEY_COMPOSE","KEY_COMPUTER","KEY_CONFIG","KEY_CONNECT","KEY_COPY","KEY_CUT","KEY_CYCLEWINDOWS","KEY_D","KEY_DEL_EOL","KEY_DEL_EOS","KEY_DELETE","KEY_DELETEFILE","KEY_DEL_LINE","KEY_DIGITS","KEY_DIRECTION","KEY_DIRECTORY","KEY_DOCUMENTS","KEY_DOT","KEY_DOWN","KEY_DVD","KEY_E","KEY_EDIT","KEY_EJECTCD","KEY_EJECTCLOSECD","KEY_EMAIL","KEY_END","KEY_ENTER","KEY_EPG","KEY_EQUAL","KEY_ESC","KEY_EXIT","KEY_F10","KEY_F11","KEY_F12","KEY_F13","KEY_F14","KEY_F15","KEY_F1","KEY_F16","KEY_F17","KEY_F18","KEY_F19","KEY_F20","KEY_F21","KEY_F22","KEY_F23","KEY_F24","KEY_F2","KEY_F","KEY_F3","KEY_F4","KEY_F5","KEY_F6","KEY_F7","KEY_F8","KEY_F9","KEY_FASTFORWARD","KEY_FAVORITES","KEY_FILE","KEY_FINANCE","KEY_FIND","KEY_FIRST","KEY_FN","KEY_FN_1","KEY_FN_2","KEY_FN_B","KEY_FN_D","KEY_FN_E","KEY_FN_ESC","KEY_FN_F","KEY_FN_F10","KEY_FN_F1","KEY_FN_F11","KEY_FN_F12","KEY_FN_F2","KEY_FN_F3","KEY_FN_F4","KEY_FN_F5","KEY_FN_F6","KEY_FN_F7","KEY_FN_F8","KEY_FN_F9","KEY_FN_S","KEY_FORWARD","KEY_FORWARDMAIL","KEY_FRONT","KEY_G","KEY_GOTO","KEY_GRAVE","KEY_GREEN","KEY_H","KEY_HANGEUL","KEY_HANJA","KEY_HELP","KEY_HENKAN","KEY_HIRAGANA","KEY_HOME","KEY_HOMEPAGE","KEY_HP","KEY_I","KEY_INFO","KEY_INSERT","KEY_INS_LINE","KEY_ISO","KEY_J","KEY_K","KEY_KATAKANA","KEY_KATAKANAHIRAGANA","KEY_KBDILLUMDOWN","KEY_KBDILLUMTOGGLE","KEY_KBDILLUMUP","KEY_KEYBOARD","KEY_KP0","KEY_KP1","KEY_KP2","KEY_KP3","KEY_KP4","KEY_KP5","KEY_KP6","KEY_KP7","KEY_KP8","KEY_KP9","KEY_KPASTERISK","KEY_KPCOMMA","KEY_KPDOT","KEY_KPENTER","KEY_KPEQUAL","KEY_KPJPCOMMA","KEY_KPLEFTPAREN","KEY_KPMINUS","KEY_KPPLUS","KEY_KPPLUSMINUS","KEY_KPRIGHTPAREN","KEY_KPSLASH","KEY_L","KEY_LANGUAGE","KEY_LAST","KEY_LEFT","KEY_LEFTALT","KEY_LEFTBRACE","KEY_LEFTCTRL","KEY_LEFTMETA","KEY_LEFTSHIFT","KEY_LINEFEED","KEY_LIST","KEY_M","KEY_MACRO","KEY_MAIL","KEY_MAX","KEY_MEDIA","KEY_MEMO","KEY_MENU","KEY_MHP","KEY_MINUS","KEY_MODE","KEY_MOVE","KEY_MP3","KEY_MSDOS","KEY_MUHENKAN","KEY_MUTE","KEY_N","KEY_NEW","KEY_NEXT","KEY_NEXTSONG","KEY_NUMLOCK","KEY_O","KEY_OK","KEY_OPEN","KEY_OPTION","KEY_P","KEY_PAGEDOWN","KEY_PAGEUP","KEY_PASTE","KEY_PAUSE","KEY_PAUSECD","KEY_PC","KEY_PHONE","KEY_PLAY","KEY_PLAYCD","KEY_PLAYER","KEY_PLAYPAUSE","KEY_POWER","KEY_POWER2","KEY_PREVIOUS","KEY_PREVIOUSSONG","KEY_PRINT","KEY_PROG1","KEY_PROG2","KEY_PROG3","KEY_PROG4","KEY_PROGRAM","KEY_PROPS","KEY_PVR","KEY_Q","KEY_QUESTION","KEY_R","KEY_RADIO","KEY_RECORD","KEY_RED","KEY_REDO","KEY_REFRESH","KEY_REPLY","KEY_RESERVED","KEY_RESTART","KEY_REWIND","KEY_RIGHT","KEY_RIGHTALT","KEY_RIGHTBRACE","KEY_RIGHTCTRL","KEY_RIGHTMETA","KEY_RIGHTSHIFT","KEY_RO","KEY_S","KEY_SAT","KEY_SAT2","KEY_SAVE","KEY_SCREEN","KEY_SCROLLDOWN","KEY_SCROLLLOCK","KEY_SCROLLUP","KEY_SEARCH","KEY_SELECT","KEY_SEMICOLON","KEY_SEND","KEY_SENDFILE","KEY_SETUP","KEY_SHOP","KEY_SHUFFLE","KEY_SLASH","KEY_SLEEP","KEY_SLOW","KEY_SOUND","KEY_SPACE","KEY_SPORT","KEY_STOP","KEY_STOPCD","KEY_SUBTITLE","KEY_SUSPEND","KEY_SWITCHVIDEOMODE","KEY_SYSRQ","KEY_T","KEY_TAB","KEY_TAPE","KEY_TEEN","KEY_TEXT","KEY_TIME","KEY_TITLE","KEY_TUNER","KEY_TV","KEY_TV2","KEY_TWEN","KEY_U","KEY_UNDO","KEY_UNKNOWN","KEY_UP","KEY_V","KEY_VCR","KEY_VCR2","KEY_VENDOR","KEY_VIDEO","KEY_VOLUMEDOWN","KEY_VOLUMEUP","KEY_W","KEY_WAKEUP","KEY_WWW","KEY_X","KEY_XFER","KEY_Y","KEY_YELLOW","KEY_YEN","KEY_Z","KEY_ZENKAKUHANKAKU","KEY_ZOOM","BTN_0","BTN_1","BTN_2","BTN_3","BTN_4","BTN_5","BTN_6","BTN_7","BTN_8","BTN_9","BTN_A","BTN_B","BTN_BACK","BTN_BASE","BTN_BASE2","BTN_BASE3","BTN_BASE4","BTN_BASE5","BTN_BASE6","BTN_C","BTN_DEAD","BTN_DIGI","BTN_EXTRA","BTN_FORWARD","BTN_GAMEPAD","BTN_GEAR_DOWN","BTN_GEAR_UP","BTN_JOYSTICK","BTN_LEFT","BTN_MIDDLE","BTN_MISC","BTN_MODE","BTN_MOUSE","BTN_PINKIE","BTN_RIGHT","BTN_SELECT","BTN_SIDE","BTN_START","BTN_STYLUS","BTN_STYLUS2","BTN_TASK","BTN_THUMB","BTN_THUMB2","BTN_THUMBL","BTN_THUMBR","BTN_TL","BTN_TL2","BTN_TOOL_AIRBRUSH","BTN_TOOL_BRUSH","BTN_TOOL_DOUBLETAP","BTN_TOOL_FINGER","BTN_TOOL_LENS","BTN_TOOL_MOUSE","BTN_TOOL_PEN","BTN_TOOL_PENCIL","BTN_TOOL_RUBBER","BTN_TOOL_TRIPLETAP","BTN_TOP","BTN_TOP2","BTN_TOUCH","BTN_TR","BTN_TR2","BTN_TRIGGER","BTN_WHEEL","BTN_X","BTN_Y","BTN_Z"];
};