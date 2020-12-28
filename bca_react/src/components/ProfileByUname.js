import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import Api from '../Api.js';
import { singOut } from '../util.js'
import Typography from '@material-ui/core/Typography';

export default function ProfileByUname() {
  let { uname } = useParams();
  let [token,] = useState(window.localStorage.getItem('user_token'));
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
    if (token === null) {
      alert("You're not signed in, please sign in");
      singOut();
      window.location = '/signin'
    }
    getUserInfo()
  }, [token, uname]);

  return (
    <div className="home">
      { userNotFound ?
        <div>
          <Typography variant="h1" align='center'>404</Typography>
          <Typography variant="h5" align='center'>User {uname} not found</Typography>
        </div>
        :
        <div>
          <Typography variant="h4" align='center'>{uname}</Typography>
          <Typography variant="subtitle1" align='center'>{fname} {lname}</Typography>
          <Typography variant="h6" align='center'>Wallet: {wallet}</Typography>
          <Typography variant="h6" align='center'>{email}</Typography>
        </div>
      }
    </div>
  )
}