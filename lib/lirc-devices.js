/**
 * Dictionary of devices and their buttons
 * @type {Object}
 */
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
 * Get Device from irsend command
 * @param  {String} error  Error from running command
 * @param  {String} stdout std out
 * @param  {String} stderr std err
 * @return {None}
 */
var getDevice = function (error, stdout, stderr) {
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
};
// Get all device information
exec("irsend list \"\" \"\"", getDevice);