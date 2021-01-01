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

    luanchSealedBid: (auction_pk, token) => {
      return axios.put(`${djangoUrl}/auction/sealed_bid/${auction_pk}/start/`, {}, {
        headers: { 'Authorization': `Token ${token}` }
      })
    },

    getAuctionByPK: (auction_pk, token) => {
      return axios.get(`${djangoUrl}/auction/sealed_bid/${auction_pk}/`,
        { headers: { 'Authorization': `Token ${token}` } }
      )
    }
  },
}
