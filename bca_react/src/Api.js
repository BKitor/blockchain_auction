import axios from 'axios';

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
            axios.post('http://127.0.0.1:8000/auction/', body,{ 
                auth: {
                    username: 'admin',
                    password: 'Passw0rd'
                },
                
            }).then(res => res),
    },
}