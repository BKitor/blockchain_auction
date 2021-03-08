import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import Api from '../../Api.js';
import Util from '../../util.js'
import Typography from '@material-ui/core/Typography';
import NotFound from '../global/NotFound.js'

export default function ProfileByUname(props) {
  let { uname } = useParams();
  const { tokenP, userP } = (props.location.state) ? props.location.state : [null, null];
  const [token, ] = (tokenP && userP) ? [tokenP, userP] : Util.checkSignedIn();

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
  }, [uname, token]);

  return (
    <div className="home">
      {(!token) ?
        < Redirect to='/signin' /> : (userNotFound) ?
          <NotFound type={"User"} identifier={uname}></NotFound>
          :
          <>
            <Typography variant="h4" align='center'>{uname}</Typography>
            <Typography variant="subtitle1" align='center'>{fname} {lname}</Typography>
            <Typography variant="h6" align='center'>Wallet: {wallet}</Typography>
            <Typography variant="h6" align='center'>{email}</Typography>
          </>
      }
    </div>
  )
}