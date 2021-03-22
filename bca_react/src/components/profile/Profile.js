import React, { useState, useEffect } from 'react';
import '../../styles/global.css';
import '../../styles/profile.css';

import { Typography } from '@material-ui/core';
import Api from '../../Api.js';
import Util from '../../util.js'

export default function Profile(props) {
  console.log(props);
  const [token] = props?.location?.state?.tokenP || Util.checkSignedIn();
  const uname = props?.location?.state?.userP || 'qwerty'; // TODO: Dynamically get this username

  let [wallet, setWallet] = useState('loading...');
  let [email, setEmail] = useState('loading...');
  let [fname, setfname] = useState('loading...')
  let [lname, setlname] = useState('loading...')
  let [userNotFound, setNotFound] = useState(false)

  useEffect(() => {
    function getUserInfo() {
      Api.user.getByUname(uname, token)
        .then(res => {
          console.log(res.data)
          setWallet(res.data.wallet)
          setEmail(res.data.email)
          setfname(res.data.first_name)
          setlname(res.data.last_name)
        })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            setNotFound(true)
          } else {
            console.log(err)
          }
        })
    }
    getUserInfo()
  }, [token, uname])

  return (
    <div>
      <div className="title page-title">
        <Typography variant="h4">Profile Information</Typography>
      </div>

      <div className="grey-container">
        <div className="profile-text">
          
            Welcome to BlockChain Auctions! An easy way to immerse yourself in the
            fast-changing world of blockchain transactions.
          
        </div>
      </div>

      <div className="grey-container">
        <div className="profile-text">

          <div className="info-text">
            <Typography variant="h6">
              Welcome back! {fname} {lname}
            </Typography>
            <div className="spacer" />
            <Typography variant="h6">
              Username: {email}
            </Typography>
            <div className="spacer" />
            <Typography variant="h6">
              Wallet ID: {wallet}

            </Typography>
          </div>
        </div>
      </div>

    </div>
  );
}