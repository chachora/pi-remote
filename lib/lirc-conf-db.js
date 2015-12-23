/**
 * Created by chachora on 12/15/15.
 */

var http = require('http');
var cheerio = require('cheerio');
var path = require('path');

const LIRC_DB_ROOT_DIR = "http://lirc.sourceforge.net/remotes/";


var doHttpRequest = function (link, cb){
    http.get(link, function (res){
        var data = '';
        res.setEncoding('utf8');

        // Collect HTML data from response
        res.on('data', function(chunk){
            data = data + chunk;
        });

        // Parse HTML
        res.on('end', function (){
            cb(data)
        });

    }).on('error', function (e){
        console.log(e.message);
    });
};

/**
 * Extracts the files and folders on the http://lirc.sourceforge.net/remotes/* pages
 * @param html
 */
var parseLircDirHtml = function(html){
    var links = [];
    var dom = cheerio.load(html);
    dom('td a').each(function (i, elem){
        if (i==0) return;

        var name = elem.children[0].data;

        // Check if file with extension and skip if yes
        if (path.extname(name) != "") return;

        // Remove / from the end of the name in case of directory
        if (name.slice(-1) == '/')
            name = name.slice(0, -1);

        links.push(name)
    });
    return links;
};

var getLircDirList = function (link, cb){
    doHttpRequest(link, function(html){
       cb(parseLircDirHtml(html));
    });
};

var getLircFile = function(link, cb){
    doHttpRequest(link, function(data){
        cb(data);
    })
};

/**
 * Connects to http://lirc.sourceforge.net/remotes/ and parsers folder structure
 * to retrieve available brands.
 */
exports.getAllBrands = function (cb){
    getLircDirList(LIRC_DB_ROOT_DIR, cb)
};

exports.getDevicesByBrand = function(brand, cb){
    getLircDirList(LIRC_DB_ROOT_DIR + brand + '/', cb);
};

exports.getDeviceConf = function(brand, device, cb){
    getLircFile(LIRC_DB_ROOT_DIR + brand + '/' + device, cb);
};
