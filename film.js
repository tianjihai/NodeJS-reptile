/**
 * Created by
 * @Auther: tianjihai
 * @Date: 2019-01-03 16:13
 */

const cheerio = require('cheerio');
const http = require('http');
const iconv = require('iconv-lite');

var index = 1; //页面数控制
var url = 'http://www.ygdy8.net/html/gndy/dyzz/list_23_';
var titles = []; //用于保存title

function getTitle(url, i) {
    console.log("正在获取第" + i + "页的内容");
    http.get(url + i + '.html', function(sres) {
        var chunks = [];
        sres.on('data', function(chunk) {
            chunks.push(chunk);
        });
        sres.on('end', function() {
            var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
            var $ = cheerio.load(html, {decodeEntities: false});
            $('.co_content8 .ulink').each(function (idx, element) {
                var ele = $(element).text();
                let ix = idx;
                titles.push({
                    index : ix,
                    title: ele
                })
            })
            if(i < 2) { //为了方便只爬了两页
                getTitle(url, ++index); //递归执行，页数+1
            } else {
                console.log(titles);
                console.log("Title获取完毕！");
            }
        });
    });
}


function getBtLink(urls, n) { //urls里面包含着所有详情页的地址
    console.log("正在获取第" + n + "个url的内容");
    http.get('http://www.ygdy8.net' + urls[n].title, function(sres) {
        var chunks = [];
        sres.on('data', function(chunk) {
            chunks.push(chunk);
        });
        sres.on('end', function() {
            var html = iconv.decode(Buffer.concat(chunks), 'gb2312'); //进行转码
            var $ = cheerio.load(html, {decodeEntities: false});
            $('#Zoom td').children('a').each(function (idx, element) {
                var $element = $(element);
                btLink.push({
                    bt: $element.attr('href')
                })
            })
            if(n < urls.length - 1) {
                getBtLink(urls, ++count); //递归
            } else {
                console.log("btlink获取完毕！");
                console.log(btLink);
            }
        });
    });
}

function save() {
    var MongoClient = require('mongodb').MongoClient; //导入依赖
    MongoClient.connect(mongo_url, function (err, db) {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log("成功连接数据库");
            var collection = db.collection('node-reptitle');
            collection.insertMany(titles, function (err,result) { //插入数据
                if (err) {
                    console.error(err);
                } else {
                    console.log("保存数据成功");
                }
            })
            db.close();
        }
    });
}

function main() {
    console.log("开始爬取");
    getTitle(url, index);
    getBtLink(url, index);
    save();
}

main(); //运行主函数



