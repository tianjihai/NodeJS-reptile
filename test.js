/**
 * Created by
 * @Auther: tianjihai
 * @Date: 2019-01-03 16:13
 */

//需先安装 cheerio和 iconv-lite 依赖
const cheerio = require('cheerio');
const http = require('http');
const iconv = require('iconv-lite');

//不支持https协议
const url = 'http://www.ggmee.com/';

http.get(url, function(sres) {
    let chunks = [];
    sres.on('data', function(chunk) {
        chunks.push(chunk);
    });
    // chunks里面存储着网页的 html 内容，将它zhuan ma传给 cheerio.load 之后
    // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
    // 剩下就都是 jQuery 的内容了
    sres.on('end', function() {
        let films = [];
        //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
        //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
        let html = iconv.decode(Buffer.concat(chunks), 'utf-8');
        let $ = cheerio.load(html, {decodeEntities: false});
        $('.nav li').each(function (idx, element) {
            let $element = $(element);
            let ix = idx;
            films.push({
                index : ix,
                title: $element.text()
            })
        })
        console.log(films);
    });
});
