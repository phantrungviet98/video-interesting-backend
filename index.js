const http = require('http');
const axios = require('axios');
const Database = require('./database');

const hostname = '0.0.0.0';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

const exist = (e) => {
  return new Promise((res, rej) => {
    const videos = Database.getDB().collection('videos')
    videos.findOne({id: e.id}, (err, suc) => {
      if (err) {
        rej(err)
      }
      if (suc) {
        res(null)
      } else {
        delete e.author
        delete e.challenges
        delete e.duetInfo
        delete e.authorStats
        res(e)
      }
    })
  })
}

server.listen(process.env.PORT || 5000, hostname, () => {
  setInterval(() => {
    axios.get('https://video-interesting.herokuapp.com/')
  }, 5*60000)
  Database.connect((err, client) => {
    if (err) console.log(err);
    const videos = Database.getDB().collection('videos')
    setInterval(() => {
      axios.get('https://t.tiktok.com/api/recommend/item_list/?aid=1988&region=VN&count=10')
      .then(({data}) => {
        Promise.all(
          data.itemList.map(e => exist(e))
        ).then(dataNotExist => {
          const dataNotNull = dataNotExist.filter(e => e !== null)
          if (dataNotNull.length > 0) {
            videos.insertMany(dataNotNull, (err, res) => {
              if (err) throw err;
              console.log('inserted: ', res.insertedCount)
            })
          } else {
            console.log('no inserted')
          }
        })
      })
      .catch(e => console.log(e))
    }, 60000)
  })
});
