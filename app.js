/**
 * app.js
 * 
 * IR Remote Web Service
 * 
  * @version 0.1.0
 */

var express = require('express');
var app = express();
var sys = require('util');
var exec = require('child_process').exec;
var lircRemotes = require('./lib/lirc-remotes');
var mustache = require('mustache-express');

// Define templates engine
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname +'/views');
app.use(express.static(__dirname + '/assets'));

// Controller the brand of the new device from LIRC database.
app.get("/devices/add", function(req,res){
    lircRemotes.getAllBrands(function(brands){
        res.render("devices_add", {
            brands: brands
        })
    });
});

// Controller for the device by specified brand from LIRC database.
app.get("/devices/add/:brand", function(req,res){
  var brand = req.params["brand"];
  lircRemotes.getDevicesByBrand(brand, function(devices){
    res.render("devices_add_brand", {
      devices: devices
    })
  });
});

// define GET request for /send/deviceName/buttonName
app.get('/send/:device/:key', function(req, res) {

  var deviceName = req.param("device");
  var key = req.param("key").toUpperCase();

  // Make sure that the user has requested a valid device 
  if(!devices.hasOwnProperty(deviceName)) {
    res.send("invalid device");
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
    res.send("invalid key number: "+key);
    return;
  }

  // send command to irsend
  var command = "irsend SEND_ONCE "+deviceName+" "+key;
  exec(command, function(error, stdout, stderr){
    if(error)
      res.send("Error sending command");
    else   
      res.send("Successfully sent command");
  });


}); // end define GET request for /send/deviceName/buttonName

// Listen on port 80
app.listen('3050');
