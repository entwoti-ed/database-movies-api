const mongoose = require('mongoose')
const Schema = mongoose.Schema
const statistics_request = new Schema({
  token: {type: String, index: true, unique: true},
  amountRequest: {type:String, expires:'1m', default: '0'}
},{collection: 'statistics_request'})
module.exports = mongoose.model('statistics_request', statistics_request)