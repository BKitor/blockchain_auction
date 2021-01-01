import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import '../styles/signin.css';
import Api from '../Api';
import Util from '../util.js';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const emails = ['16jw98@queensu.ca', 'other_user@gmail.com'];

export default function Signin() {

  const [tmp_token, tmp_user] = Util.checkSignedIn();

  const [signinOpen, setSigninOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [selectedValue] = useState(emails[0]);
  const [user, setUser] = useState(tmp_user);
  const [token, setToken] = useState(tmp_token);

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
      { !(user && token) ?
        <div>
          <h1>Sign in page </h1>
          <Button onClick={handleSignInClick}>Sign In</Button>
          <Button onClick={handleSignUpClick}>Sign Up</Button>
          <div>
            <a href="/">Forgot your password?</a>
          </div>
          {/* <SigninPopUp setSignedIn={setSignedIn} setUser={setUser} selectedValue={selectedValue} open={signinOpen} onClose={handleClose} setToken={setToken} /> */}
          <SigninPopUp setUser={setUser} selectedValue={selectedValue} open={signinOpen} onClose={handleClose} setToken={setToken} />
          <SignupPopUp selectedValue={selectedValue} open={signupOpen} setUser={setUser} setToken={setToken} onClose={handleClose} />
        </div>
        :
        <Redirect to={{
          pathname: `/user/${user.username}`,
          state: { tokenP: token, userP: user }
        }} />
      }
    </div>
  )
}

function SigninPopUp(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { onClose, selectedValue, open, setUser, setToken } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSignIn = () => {
    Api.user.getToken(username, password).then(res => {
      if (res.data) {
        setToken(res.data.token)
      }
      return [username, res.data.token]
    }).then(([uname, token]) => {
      Api.user.getByUname(uname, token).then(res => {
        setUser(res.data)
        Util.signIn(token, res.data)
      })
    })
      .catch(err => {
        window.alert("Invalid Credentials");
      })

    onClose();
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Sign In</DialogTitle>
      <div style={{ width: '80%', margin: 'auto' }}>
        <TextField autoFocus onChange={handleUserNameChange} placeholder='username'></TextField>
        <TextField onChange={handlePasswordChange} placeholder='password' type='password'></TextField>
        <Button onClick={handleSignIn}>Sign In!</Button>
      </div>
    </Dialog>
  );
}

function SignupPopUp(props) {
  const { onClose, selectedValue, open, setUser, setToken } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState('');

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleSignUp = (value) => {
    Api.user.createNewUser({ username, password, wallet })
      .then(res => {
        if (res.status === 200) {
          return Promise.all([
            Api.user.getToken(username, password),
            Promise.resolve(res.data)
          ])
        }
      })
      .then(([res, user]) => {
        if (res.data && res.data.token) {
          Util.signIn(res.data.token, user)
          setUser(user)
          setToken(res.data.token)
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400 && err.response.data) {
          alert(err.response.data.message)
        }
      })
    handleClose(value);
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Sign up from a new account</DialogTitle>
      <div style={{ width: '50%', margin: 'auto' }}>
        <TextField autoFocus placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
        <TextField placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
        <TextField placeholder="Wallet" onChange={(e) => { setWallet(e.target.value) }} />
        <Button onClick={handleSignUp}>Sign up!</Button>
      </div>
    </Dialog>
  );
}