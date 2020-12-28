function checkSignedIn(setToken, setUser) {
    if (window.localStorage.getItem('user_token') && window.localStorage.getItem('user')) {
        setUser(JSON.parse(window.localStorage.getItem('user')).user_id)
        setToken(window.localStorage.getItem('user_token'))
    } else {
        window.location = '/signin'
    }
}

function singOut() {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('user_token');
}

export { checkSignedIn, singOut };
