/**
 * Created by spirit on 12/15/15.
 */

var http = require('http');
var cheerio = require('cheerio');

const LIRC_DB_ROOT_DIR = "http://lirc.sourceforge.net/remotes/";

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
        if (name.slice(-1) == '/')
            name = name.slice(0, -1);
        links.push(name)
    });
    return links;
};

var getLircFiles = function (link, cb){
    http.get(link, function (res){
        var html = '';
        res.setEncoding('utf8');

        // Collect HTML data from response
        res.on('data', function(chunk){
            html = html + chunk;
        });

        // Parse HTML
        res.on('end', function(){
            cb(parseLircDirHtml(html));
        })

    }).on('error', function (e){
        console.log(e.message);
    });
};

/**
 * Connects to http://lirc.sourceforge.net/remotes/ and parsers folder structure
 * to retrieve available brands.
 */
exports.getAllBrands = function (cb){
    getLircFiles(LIRC_DB_ROOT_DIR, cb)
};

exports.getDevicesByBrand = function(brand, cb){
    getLircFiles(LIRC_DB_ROOT_DIR + brand + '/', cb);
};
