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
      return Promise.resolve({
        "data": {
          "url": "http://localhost:8000/auction/sealed_bid/1/",
          "id": 1,
          "owner": 1,
          "end_time": "2002-08-02T00:00:00Z",
          "auction_id": "",
          "min_bid": 5,
          "item_description": "this is an item test"
        },
        "status": 200
      })
    },

    launchEnglish: (auction_pk, token) => {
      return Promise.resolve({
        "data": {
          "url": "http://localhost:8000/auction/sealed_bid/1/",
          "id": 1,
          "owner": 1,
          "end_time": "2002-08-02T00:00:00Z",
          "auction_id": "",
          "min_bid": 5,
          "item_description": "this is an item test"
        },
        "status": 200
      })
    },

    getEnglishByPK: (auction_pk, token) => {
      return Promise.resolve({
        "data": {
          "url": "http://localhost:8000/auction/sealed_bid/1/",
          "id": 1,
          "owner": 1,
          "end_time": "2002-08-02T00:00:00Z",
          "auction_id": "",
          "min_bid": 5,
          "item_description": "this is an item test"
        },
        "status": 200
      })
      // return axios.get(`${djangoUrl}/auction/english/${auction_pk}/`,
      //   { headers: { 'Authorization': `Token ${token}` } }
      // )
    },
  }
}
