let express = require('express');
let router = express.Router();
let dataMovies = require('./../models/data-movies')
let User = require('./../models/user')
let statsRequest = require('./../models/statistics-request')
/* GET home page. */

function checkCredential(token,res, cb ) {
  User.findOne({token: token}, function(err, docs) {
    if (!docs) {
      return res.json({
        status: false,
        message: 'invalid key token.'
      })
    } if (docs) cb(docs)
  })
}

function checkRequestLimit(token, res, cb) {
  statsRequest.findOne({token: token}, (err, doc) => {

    let limitRequest = false, alreadyExist = false
    
    if (doc) {
      if (doc.amountRequest > 300) limitRequest = true
      alreadyExist = true
    }
    else {
      statRequest = new statsRequest({
        token: token,
        amountRequest: 1
      })
      statRequest.save()
    }

    if (alreadyExist) {
      if (limitRequest) {
        return res.json({
          status: false,
          message: 'You have exceeded your request limit, email me for subscription and verification (gagasrvps08@gmail.com)'
        })
      } else {
        doc.token = doc.token
        doc.amountRequest = parseInt(doc.amountRequest) + 1
        doc.save()
      }
    }
    cb()
  })
}


router.get('/movies', function(req, res, next) {
  let limit = 15
  let search = 0
  let page = 0
  let query

  checkCredential(req.query.key_token, res, docs => {
    if (req.query.limit) {
      if(req.query.limit > 50) {
        limit = 15
      } else limit = parseInt(req.query.limit)
    }
    if (req.query.search) search = req.query.search
    
    if(req.query.page) page = req.query.page
 
    if (!search) query = dataMovies.find({})

    else query = dataMovies.find({title: { $regex:  req.query.search, $options: 'i'}})

    checkRequestLimit(req.query.key_token, res, () => {
      query.limit(limit).skip(10*page).exec((err, docs) => {
        return res.json({status: true,dataLength: docs.length,data: docs})
      })
    })
  })
})

router.get('/movies/genre', (req, res, next) => {
  let limit = 15
  let page = 0
  let genre
  checkCredential(req.query.key_token, res, doc => {
    if (!req.query.genre) {
      return res.json({
        status: false,
        message: 'Field genre required!'
      })
    }
    if (req.query.genre) genre = req.query.genre
    if (req.query.limit) {
      if(req.query.limit > 50) {
        limit = 15
      } else limit = parseInt(req.query.limit)
    }
    if (req.query.page) page = req.query.page
    let query = dataMovies.find({'movieInformation.genre': { $regex: genre, $options: 'i'}})
    checkRequestLimit(req.query.key_token, res, () => {
      query.limit(limit).skip(10*page).exec((err, docs) => {
        if (docs) {
          return res.json({
            status: true, dataLength: docs.length, data: docs
          })
        }
      })
    })
    // dataMovies.find({'movieInformation.genre': { $regex: /science/i, $nin: [ 'genre' ] }}).exec(function(err, docs) {
    //   docs.forEach((data, index) => {
    //     console.log(index, data)
    //   })
    //   console.log(docs.length)
    // })
  })
})


module.exports = router;
