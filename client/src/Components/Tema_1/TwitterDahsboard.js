import React, { useState, useEffect, useReducer } from 'react';

import { getTweets } from '../../Http/TwitterAPI';
import { mergeUserByTweets } from '../../helpers';
import { HASHTAGS } from '../../Constant';

import TopMetrics from './Components/TopMetrics';
import Select from '../Common/Select';
import { isEmpty, values } from 'lodash';

const TwitterDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [topInfluentialUser, setTopInfluentialUser] = useState([]);
  const [topFollowers, setTopFollowers] = useState([]);
  const [topHashtag, setTopHashtag] = useState([]);
  const [topLang, setTopLang] = useState([]);

  const [tweetsByHash, dispatchTweet] = useReducer(addTweets, {});
  const [userByHash, dispatchUser] = useReducer(addUser, {});

  function addTweets(state, action) {
    switch (action.type) {
      case 'addTweet':
        return { ...state, [action.payload.hashtag]: action.payload.tweets };
      default:
        throw new Error();
    }
  }

  function addUser(state, action) {
    switch (action.type) {
      case 'addUser':
        return { ...state, [action.payload.hashtag]: action.payload.user };
      default:
        throw new Error();
    }
  }

  const dispatchByTweet = (tweets, hashtag, user) => {
    dispatchTweet({
      type: 'addTweet',
      payload: {
        tweets,
        hashtag,
      },
    });

    dispatchUser({
      type: 'addUser',
      payload: {
        user,
        hashtag,
      },
    });
  };

  useEffect(() => {
    loadTweets();
  }, []);

  useEffect(() => {
    mostUsedHashtag();
  }, [tweetsByHash]);

  useEffect(() => {
    if (!isEmpty(userByHash)) {
      mostUsedLang();
    }
  }, [userByHash]);

  useEffect(() => {
    if (userByHash[selectedHashtag]) {
      mostInfluyent();
      moreFollowers();
    }
  }, [selectedHashtag]);

  const formatDate = () => {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const getRandomInt = () => {
    return Math.floor(Math.random() * (100 - 20)) + 20;
  };

  const loadTweets = async () => {
    for (const query of HASHTAGS) {
      const [tweets, user] = await tweet(query);
      dispatchByTweet(tweets, query, user);
    }
    // mostUsedHashtag();
    // Calcular lenguaje y calcular
    setLoading(true);
  };

  const tweet = async (hashtag) => {
    const payload = {
      hashtag: `%23${hashtag}`,
      count: getRandomInt(),
      until: formatDate(),
    };

    const tweets = await getTweets(payload);
    const user = await mergeUserByTweets(tweets);
    return [tweets, user];
  };

  const selectHashtag = ({ value }) => {
    setSelectedHashtag(value);
  };

  const mostInfluyent = () => {
    const users = userByHash[selectedHashtag]
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 5)
      .map((user) => {
        return { ...user, influence: user.influence.toFixed(2) };
      });
    setTopInfluentialUser(users);
  };

  const moreFollowers = () => {
    const users = userByHash[selectedHashtag]
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 5);
    setTopFollowers(users);
  };

  const mostUsedHashtag = () => {
    let hashtagCount = [];
    for (let hashtag in tweetsByHash) {
      hashtagCount = [
        ...hashtagCount,
        { hashtag, total: tweetsByHash[hashtag].length },
      ];
    }
    setTopHashtag(hashtagCount.sort((a, b) => b.total - a.total).slice(0, 5));
  };

  const mostUsedLang = () => {
    let langCount = {};
    for (let users in userByHash) {
      for (let user of userByHash[users]) {
        const { lang } = user;
        langCount = {
          ...langCount,
          [lang]:
            langCount[lang] >= 0 ? (langCount[lang] = langCount[lang] + 1) : 0,
        };
      }
    }
    let arrayLang = [];

    for (let lang in langCount) {
      arrayLang = [...arrayLang, { lang, total: langCount[lang] }];
    }
    setTopLang(arrayLang.sort((a, b) => b.total - a.total).slice(0, 3));
  };

  return (
    <div className="w-full">
      <div className="w-full p-2 text-center font-semibold ">Tema 1</div>
      <Select
        className="w-1/2 md:w-1/4  ml-2 my-4"
        placeholder="Elija el hashtag"
        options={HASHTAGS.map((hashtag) => {
          return { value: hashtag, label: hashtag };
        })}
        changeValue={selectHashtag}
        setSelectedHashtag={setSelectedHashtag}
      />
      <div className="flex flex-col px-2 md:px-0 md:flex-row justify-start w-full">
        <TopMetrics
          number="5"
          title="Usuario más Influyente"
          values={topInfluentialUser || []}
          labelKey={'userName'}
          valueKey={'influence'}
          titles={{ left: 'Usuario', right: 'tasa de influencia' }}
        />
        <TopMetrics
          number="5"
          title="Hashtag más usado"
          values={topHashtag || []}
          labelKey={'hashtag'}
          valueKey={'total'}
          titles={{ left: 'Hashtag', right: 'Total' }}
        />
        <TopMetrics
          number="5"
          title="Usuarios con mayor followers"
          values={topFollowers || []}
          labelKey={'userName'}
          valueKey={'followers'}
          titles={{ left: 'Usuario', right: 'Seguidores' }}
        />
      </div>
      <div className="flex flex-col px-2 md:px-0 md:flex-row justify-start w-full">
        <TopMetrics
          number="3"
          title="Lenguajes más usados"
          values={topLang || []}
          labelKey={'lang'}
          valueKey={'total'}
          titles={{ left: 'Lenguaje', right: 'Total' }}
        />
      </div>
    </div>
  );
};

export default TwitterDashboard;
