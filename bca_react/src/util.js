export default {
    // bcURL: "ws://localhost:8545",
    bcURL: (window.ethereum && window.ethereum.isMetaMask)?window.ethereum:"ws://localhost:8545",

    checkSignedIn: () => {
        const token = window.localStorage.getItem('user_token');
        const user = JSON.parse(window.localStorage.getItem('user'));
        return [token, user]
    },

    singOut: () => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('user_token');
    },

    signIn: (token, user) => {
        if (token) {
            window.localStorage.setItem('user_token', token);
        }
        if (user) {
            window.localStorage.setItem('user', JSON.stringify(user))
        }
    }
}

