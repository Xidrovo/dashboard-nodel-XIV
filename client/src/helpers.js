export const mergeUserByTweets = (tweets) => {
  let users = {};
  tweets.forEach(({ user, lang, retweet_count }) => {
    const retweets = users[user.id]
      ? users[user.id].retweets + retweet_count
      : retweet_count;
    const followers = user.followers_count;
    const following = user.friends_count;
    const influence = followers === 0 ? 0 : (retweets * following) / followers;

    users = {
      ...users,
      [user.id]: {
        id: user.id,
        userName: user.screen_name,
        verified: user.verified,
        followers,
        following,
        lang,
        retweets,
        influence,
      },
    };
  });
  console.log(Object.values(users));
  return Object.values(users);
};
