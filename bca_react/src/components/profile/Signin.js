import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link'
import '../../styles/profile.css';

import Api from '../../Api';
import Util from '../../util.js';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const emails = ['16jw98@queensu.ca', 'other_user@gmail.com'];

export default function Signin() {

  const [tmp_token, tmp_user] = Util.checkSignedIn();

  const [signupOpen, setSignupOpen] = useState(false);
  const [selectedValue] = useState(emails[0]);
  const [user, setUser] = useState(tmp_user);
  const [token, setToken] = useState(tmp_token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSignIn = () => {
    Api.user.getToken(username, password).then(res => {
      return Promise.all([username, res.data.token])
    }).then(([uname, token]) => {
      Api.user.getByUname(uname, token).then(res => {
        Util.signIn(token, res.data)
        window.location = '/profile'
      })
    })
      .catch(err => {
        window.alert("Invalid Credentials");
      })

  }

  const handleSignUpClick = () => {
    setSignupOpen(true);
  }

  const handleClose = () => {
    setSignupOpen(false);
  }

  return (
    <div className="home">
      { !(tmp_user && tmp_token) ?
        <div>
          <div className="title page-title">
            <Typography variant="h4">Welcome to BlockChain Auctions!</Typography>
          </div>
          <div className="grey-container">
          <Typography variant="h6">Sign in and get started!</Typography>

          <br />
          <br />

            <TextField placeholder='Username' onChange={handleUserNameChange} type="email" />
            <br />
              <br />
            <br />

            <TextField placeholder='Password' onChange={handlePasswordChange} type="password"/>
            <br />
              <br />
            <br />

            <Button style={{width: '70%'}} variant='contained' color="primary" onClick={handleSignIn}>
              <Typography variant="h6">Sign In</Typography>
            </Button>

              <br />
              <br />
                <Link onClick={handleSignUpClick} style={{textDecoration: 'underline', color:'white', cursor:'pointer'}}>Create an account?</Link>
                
          </div>

          <SignupPopUp selectedValue={selectedValue} open={signupOpen} setUser={setUser} setToken={setToken} onClose={handleClose} />
        </div>
        :
        <Redirect to={{
          pathname: `/profile`,
          state: { tokenP: token, userP: user }
        }} />
      }
    </div>
  )
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
      <br/>
      <br/>

      <DialogTitle id="simple-dialog-title">Create Account</DialogTitle>
      <div style={{ width: '50%', margin: 'auto' }}>

        <TextField autoFocus placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
      <br/>
        <br/>

        <TextField placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
        <br/>
        <br/>

        <TextField placeholder="Wallet" onChange={(e) => { setWallet(e.target.value) }} />
        <br/>
        <br/>
        <br/>

        <Button color="primary" variant="contained" onClick={handleSignUp}>Sign Up!</Button>
        <br/>

      </div>
    </Dialog>
  );
}