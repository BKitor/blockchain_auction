import {useRef, useEffect} from 'react'
export default {
    bcURL: "ws://localhost:8545",

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
    },

    // from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    useInterval: (callback, delay) => {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback
        }, [callback])

        useEffect(() => {
            function tick() {
                savedCallback.current()
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }
}

