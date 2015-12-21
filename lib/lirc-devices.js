/**
 * Dictionary of devices and their buttons
 * @type {Object}
 */

var fs = require("fs");
var exec = require('child_process').exec;

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
var getDevices = function (cb){
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
getDevices(function () {});

/**
 * Rewrites /etc/lirc/lircd.conf file and restarts LIRC daemon.
 * @param {String} conf Content of the lircd.conf file
 */
exports.updateConf = function(conf, cb)
{
    // Stop LIRC daemon
    exec("sudo /etc/init.d/lirc stop", function (error) {
        if (error) {
            console.log(error);
            cb();
            return;
        }

        // Save lircd.conf file
        fs.writeFileSync("/etc/lirc/lircd.conf", conf);

        // Start LIRC daemon
        exec("sudo /etc/init.d/lirc start", function(error){
            if (error){
                console.log(error);
                cb();
                return;
            }
            getDevices(cb());
        });

    });
};

exports.sendCommand = function(deviceName, key, cb){
    // Make sure that the user has requested a valid device
    if(!devices.hasOwnProperty(deviceName)) {
        cb("invalid device");
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
    var device = devices[Object.keys(devices)[0]];
    if (!device)
        return "none";
    else
        return device;
};