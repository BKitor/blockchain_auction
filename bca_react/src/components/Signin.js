import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
// import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';

import '../styles/signin.css';
import api from '../Api';

const emails = ['16jw98@queensu.ca', 'other_user@gmail.com'];

// const useStyles = makeStyles({
//     avatar: {
//         backgroundColor: blue[100],
//         color: blue[600],
//     },
// });

export default function Signin() {
    const [signinOpen, setSigninOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [selectedValue] = React.useState(emails[0]);
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        function checkSignedIn() {
            if (window.localStorage.getItem('user')) {
                setUser(JSON.parse(window.localStorage.getItem('user')))
                setSignedIn(true);
            }
        }
        checkSignedIn();
    }, []);

    const handleSignInClick = () => {
        setSigninOpen(true);
    }

    const handleSignUpClick = () => {
        setSignupOpen(true);
    }

    const handleClose = () => {
        setSigninOpen(false);
        setSignupOpen(false);
    }

    return (
        <div className="home">
            { !signedIn ? 
            <div>
            <h1>Sign in page </h1>
            <Button onClick={handleSignInClick}>Sign In</Button>
            <Button onClick={handleSignUpClick}>Signup</Button>
            <div>
                <a href="/">Forgot your password?</a>
            </div>
            <SigninPopUp setSignedIn={setSignedIn} setUser={setUser} selectedValue={selectedValue} open={signinOpen} onClose={handleClose} />
            <SignupPopUp selectedValue={selectedValue} open={signupOpen} onClose={handleClose} />
            </div>
            :
            <div>
                <h1>Welcome back {user && user.first_name}</h1>
            </div>
}
        </div>
    )
}

function SigninPopUp(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { onClose, selectedValue, open, setUser, setSignedIn } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    // const handleListItemClick = (value) => {
    //     onClose(value);
    // };

    const handleUserNameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignIn = () => {
        api.user.signin(username, password).then(res => {
            if (res.data){
            console.log(res.data.results[0]);
            setUser(res.data.results[0]);
            window.localStorage.setItem('user', JSON.stringify(res.data.results[0]))
            setSignedIn(true);

            } 
        }).catch(err => { 
                window.alert("Invalid Credentials");
        })
        
        onClose();
    }
    
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Sign In</DialogTitle>
            <div style={{width: '80%', margin: 'auto'}}>
            <TextField onChange={handleUserNameChange} placeholder='username'></TextField>
            <TextField onChange={handlePasswordChange} placeholder='password' type='password'></TextField>
            <Button onClick={handleSignIn}>Sign In!</Button>
            </div>
        </Dialog>
    );
}

function SignupPopUp(props) {
    const { onClose, selectedValue, open } = props;


    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleSignUp = (value) => {
        alert("New User Signing up!")
        onClose(value);
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Sign up from a new account</DialogTitle>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Password"
                type="password"
            /> <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Confirm Password"
                type="password"
            />
            <Button onClick={handleSignUp}>Sign up!</Button>
        </Dialog>
    );
}