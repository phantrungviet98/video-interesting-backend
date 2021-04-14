const axios = require('axios');
const Database = require('./database');
const app = require('express')();
const url = require('url');

app.get('/', (req, response) => {
  // const queryData = new URL(req.url);
  // console.log('queryData', queryData.searchParams)
  // const videos = Database.getDB().collection('videos')
  // videos.find().limit(1).toArray((err, res) => {
  //   response.send(res)
  // })
})

app.use(function(req, res, next) {
  req.getUrl = function() {
    return req.protocol + "://" + req.get('host') + req.originalUrl;
  }
  return next();
});

app.get('/videos', (req, response) => {
  const queryParams = new URL(req.getUrl());
  const offset = parseInt(queryParams.searchParams.get('offset'))
  console.log('offset', offset)
  const videos = Database.getDB().collection('videos')
  videos.find().skip(offset).limit(10).toArray((err, res) => {
    response.send(res)
  })
})

const server = app.listen(process.env.PORT || 5000, () => {
  const host = server.address().address
  const port = server.address().port

  Database.connect((err, client) => {
    if (err) console.log(err);
  })

  console.log(`App listening at http://${host}:${port}`)
})

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

// server.listen(process.env.PORT || 5000, hostname, () => {
//   setInterval(() => {
//     axios.get('https://video-interesting.herokuapp.com/')
//   }, 5*60000)
//   Database.connect((err, client) => {
//     if (err) console.log(err);
//     const videos = Database.getDB().collection('videos')
//     setInterval(() => {
//       axios.get('https://t.tiktok.com/api/recommend/item_list/?aid=1988&region=VN&count=10')
//       .then(({data}) => {
//         Promise.all(
//           data.itemList.map(e => exist(e))
//         ).then(dataNotExist => {
//           const dataNotNull = dataNotExist.filter(e => e !== null)
//           if (dataNotNull.length > 0) {
//             videos.insertMany(dataNotNull, (err, res) => {
//               if (err) throw err;
//               console.log('inserted: ', res.insertedCount)
//             })
//           } else {
//             console.log('no inserted')
//           }
//         })
//       })
//       .catch(e => console.log(e))
//     }, 60000)
//   })
// });
