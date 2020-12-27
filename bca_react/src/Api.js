import axios from 'axios';

const djangoUrl = 'http://127.0.0.1:8000'

export default {
    user: {
        signin: (username, pw) =>
            axios.get('http://127.0.0.1:8000/profile/',
                {
                    auth: {
                        username,
                        password: pw
                    }
                },
            ).then(res => res)
    },
    auctions: {
        newSealedBid: (body, username, password) =>
            axios.post('http://127.0.0.1:8000/auction/', body, {
                auth: {
                    username: 'admin',
                    password: 'Passw0rd'
                },

            }).then(res => res),

        luanchSealedBid: (auction_pk, username, password) =>
            axios.put(`http://127.0.0.1:8000/auction/${auction_pk}/start_auction`, {
            }, {
                auth: {
                    username: 'admin',
                    password: 'Passw0rd'
                },
            }).then(res => res),

        getAuctionByPK: (auction_pk) =>
            axios.get(`${djangoUrl}/auction/${auction_pk}/`, {
                auth: {
                    username: 'admin',
                    password: 'Passw0rd'
                },
            }).then(res => res).catch(err=>console.error(err))

    },
}
