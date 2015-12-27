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
var lircConfDb = require('./lib/lirc-conf-db');
var lircDevices = require("./lib/lirc-devices");
var mustache = require('mustache-express');
var voiceCommands = require('./controllers/voice-commands.js')(app);

// Define templates engine
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname +'/views');
app.use(express.static(__dirname + '/assets'));

app.get("/", function(req,res){
    res.render("index", {
        device: lircDevices.getCurrentDevice()
    })
});

/**
 * Controller the brand of the new device from LIRC database.
 */
app.get("/devices/add", function(req,res){
    lircConfDb.getAllBrands(function(brands){
        res.render("devices_add", {
            brands: brands
        })
    });
});

 /**
  * Controller for the device list by specified brand from LIRC database.
  */
app.get("/devices/add/:brand", function(req,res){
  var brand = req.params["brand"];
  lircConfDb.getDevicesByBrand(brand, function(devices){
    res.render("devices_add_brand", {
      brand: brand,
      devices: devices
    })
  });
});

 /**
  * Controller for saving the LIRC configuration file of the specified device.
  */
 app.get("/devices/add/:brand/:device",function(req,res){
     var brand = req.params["brand"];
     var device = req.params["device"];
     lircConfDb.getDeviceConf(brand, device, function(conf){
         lircDevices.updateConf(conf, function(){
             res.redirect("/");
         });
     });
 });

 /**
  * Controller for the send command result display.
  */
app.get("/send/result/:msg", function(req, res) {
    res.redirect('/');
});

// define GET request for /send/deviceName/buttonName
app.get('/send/:device/:key', function(req, res) {

    var device = req.params["device"];

    // Check if device is specified
    if (device == "none")
    {
        res.redirect('/');
        return;
    }

    var key = req.params["key"].toUpperCase();
    lircDevices.sendCommand(device, key, function (msg){
        console.log(msg);
        res.redirect('/')
    })

});

// Listen on port 3000
 var port = process.env.PORT || 3000;
 app.listen(port);
