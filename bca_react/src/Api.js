import axios from 'axios';

const djangoUrl = 'http://127.0.0.1:8000'

export default {
    user: {
        getToken: (username, password) =>
            axios.post(`${djangoUrl}/api-token-auth/`,
                {
                    username,
                    password
                }
            ).then(res => res),
        getByUname: (username, token) =>
            axios.get(`${djangoUrl}/profile/uname/${username}/`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            ).then(res => res)

    },
    auctions: {
        newSealedBid: (body, token) => {
            return axios.post(`${djangoUrl}/auction/`, body,
            {
                headers: {
                    'Authorization': `Token ${token}`
                }
            } )
        },

        luanchSealedBid: (auction_pk, token) => {
            return axios.put(`${djangoUrl}/auction/${auction_pk}/start_auction`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
        },

        getAuctionByPK: (auction_pk, token) =>{
            return axios.get(`${djangoUrl}/auction/${auction_pk}/`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            )
        }
    },
}
