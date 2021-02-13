require('dotenv').config({path: __dirname + '/.env'})
const axios = require('axios').default
const crypto = require('crypto')
const oauth1a = require('oauth-1.0a')

const CONSUMERKEY = process.env.TWITTER_KEY
const CONSUMERSECRET = process.env.TWITTER_SECRET
const TOKENKEY = process.env.ACCESS_TOKEN
const TOKENSECRET = process.env.TOKEN_SECRET
const apiBase = "https://api.twitter.com/1.1/" 

const getAuthHeaderForRequest = (request) => {
  const oauth = oauth1a({
    consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64')
    },
  })

  const authorization = oauth.authorize(request, {
    key: TOKENKEY,
    secret: TOKENSECRET,
  })

  return oauth.toHeader(authorization)
}

const getTweets = (hashtag = "", count = 20, until) => {
  console.log("process env: ", process.env.CONSUMERKEY)
  const APIURL =
    `${apiBase}search/tweets.json?q=${hashtag}&count=${count}&until=${until}&include_entities=true`
  const request = {
    url: APIURL,
    method: 'GET',
  }
  const authHeader = getAuthHeaderForRequest(request)
  return axios
    .get(APIURL, { headers: authHeader })
    .then(( { data } ) => {
      return data
    })
    .catch((err) => {
      console.log('Error!', err)
    })
}

exports.getTweets = getTweets