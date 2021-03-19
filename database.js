const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://vietphan:abc123456@cluster0.c1y9k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
let _db;

const Database = {
	getDB: () => {
		return _db
	},
	connect: (callback) => {
		MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
			_db = db.db('tiktokCrawl')
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				console.log('Connection established to', url);
				callback(err, db);
			}
		})
	}
}

module.exports = Database