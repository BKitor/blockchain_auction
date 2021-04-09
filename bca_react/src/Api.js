import axios from 'axios';

const djangoUrl = 'http://127.0.0.1:8000'

export default {
  user: {
    getToken: (username, password) =>
      axios.post(`${djangoUrl}/api-token-auth/`, { username, password }
      ).then(res => res),

    getByUname: (username, token) =>
      axios.get(`${djangoUrl}/profile/uname/${username}/`, {
        headers: { 'Authorization': `Token ${token}` }
      }).then(res => res),

    createNewUser: (user) =>
      axios.post(`${djangoUrl}/newuser/`, user, {})
  },
  auctions: {
    newSealedBid: (body, token) => {
      return axios.post(`${djangoUrl}/auction/sealed_bid/`, body,
        { headers: { 'Authorization': `Token ${token}` } })
    },
    launchSealedBid: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/sealed_bid/${auction_pk}/start/`, {}, {
        headers: { 'Authorization': `Token ${token}` }
      })
    },
    getSealedBidByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/sealed_bid/${auction_pk}/`,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },

    newEnglish: (body, token) => {
      return axios.post(`${djangoUrl}/auction/english_auction/`, body,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    launchEnglish: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/english_auction/${auction_pk}/start/`, {},
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    getEnglishByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/english_auction/${auction_pk}/`, 
        {headers: { 'Authorization': `Token ${token}` }}
      ) 
    },

    newDutch: (body, token) => {
      return axios.post(`${djangoUrl}/auction/dutch_auction/`, body,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    launchDutch: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/dutch_auction/${auction_pk}/start/`, {},
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    getDutchByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/dutch_auction/${auction_pk}/`, 
        {headers: { 'Authorization': `Token ${token}` }}
      ) 
    },

    newChannel: (body, token) => {
      return axios.post(`${djangoUrl}/auction/channel_auction/`, body,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    launchChannel: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/channel_auction/${auction_pk}/start/`, {},
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    getChannelByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/channel_auction/${auction_pk}/`, 
        {headers: { 'Authorization': `Token ${token}` }}
      ) 
    },


    newSqueeze: (body, token) => {
      return axios.post(`${djangoUrl}/auction/squeeze_auction/`, body,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    launchSqueeze: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/squeeze_auction/${auction_pk}/start/`, {},
        { headers: { 'Authorization': `Token ${token}` } }
      )
    },
    getSqueezeByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/squeeze_auction/${auction_pk}/`, 
        {headers: { 'Authorization': `Token ${token}` }}
      ) 
    },

  }
}
