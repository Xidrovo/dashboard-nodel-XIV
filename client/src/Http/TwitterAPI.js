const axios = require('axios').default;
const pick = require('lodash').pick;

export const getTweets = (payload) => {
  return axios
    .post('http://localhost:5000/twitter', payload)
    .then(({ data }) => {
      const tweet = data.map((tw) => {
        return pick(tw, [
          'lang',
          'favorite_count',
          'retweet_count',
          'created_at',
          'user',
          'text',
          'source',
          'id',
        ]);
      });
      return tweet;
    })
    .catch((err) => {
      console.log('Error!', err);
      return {};
    });
};
