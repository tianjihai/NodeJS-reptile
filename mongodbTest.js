/**
 * Created by
 * @Auther: tianjihai
 * @Date: 2019-01-03 18:36
 */

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    db.close();
});
