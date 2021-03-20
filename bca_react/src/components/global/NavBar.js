import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import Util from '../../util.js'

import '../../styles/nav.css';
import { Button } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  colorPrimary: {
    color: '#141D26'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function NavBar() {
  const [token, user] = Util.checkSignedIn();
  const classes = useStyles();
  const [anchorAuctions, setAnchorAuctions] = useState(null);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const openAuctions = Boolean(anchorAuctions);
  const openProfile = Boolean(anchorProfile);

  /* Nav Bar Callbacks */
  const openAuctionMenu = (event) => {
    setAnchorAuctions(event.currentTarget);
  };

  const openProfileMenu = (event) => {
    setAnchorProfile(event.currentTarget);
  }

  const handleCloseProfile = () => {
    setAnchorProfile(null);
  }

  const handleEditProfile = () => {
    setAnchorProfile(null);
    window.location = '/profile'
  }

  const handleAuth = () => {
    if (!token) {
      setAnchorProfile(null);
      window.location = '/sign-in'
    } else {
      Util.singOut();
      window.location = '/sign-in'
    }
  }

  const handleSealed = () => {
    setAnchorAuctions(null);
    window.location = '/auctions/sealed-bid'
  }

  const handleEnglish = () => {
    setAnchorAuctions(null);
    window.location = '/auctions/english-bid'
  }

  const handleDutch = () => {
    setAnchorAuctions(null);
    window.location = '/auctions/dutch-bid'
  }

  const handleChannel = ()=>{
    setAnchorAuctions(null);
    window.location = '/channel'
  }

  const handleSquezeAuctions = (e) =>{
    setAnchorAuctions(null);
    window.location = '/squeeze'
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" noWrap>
            <Link to='/' className="nav-title">BlockChain Auctions</Link>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <div className="container">
              {/* About Link */}
              <Button variant='text'>
                <div>
                  <Link to="/about">
                    About
                  </Link>
                </div>
              </Button>
              {user ?
                <>
                  {/* Auctions Dropdown */}
                  <Button variant='text' onClick={openAuctionMenu}>
                    <div><a>Auctions</a></div>
                  </Button>
                  <Menu
                    id="fade-menu"
                    anchorEl={anchorAuctions}
                    keepMounted
                    open={openAuctions}
                    onClose={handleCloseAuctions}
                    TransitionComponent={Fade}
                  >
                    <MenuItem onClick={handleViewAuctions}><a>All Auctions</a></MenuItem>
                    <MenuItem onClick={handleSealed}><a>Sealed Bid</a></MenuItem>
                    <MenuItem onClick={handleEnglish}><a>English Bid</a></MenuItem>
                    <MenuItem onClick={handleDutch}><a>Dutch Bid</a></MenuItem>
                  </Menu>
                  {/* Check if signed in, display profile if they are, or Sign In if not */}
                  {/* Profile Dropdown */}
                  <Button variant='text' onClick={openProfileMenu}>
                    <div><a>Profile</a></div>
                  </Button>
                  <Menu
                    id="fade-menu"
                    anchorEl={anchorProfile}
                    keepMounted
                    open={openProfile}
                    onClose={handleCloseProfile}
                    TransitionComponent={Fade}
                  >
                    {
                      user &&
                      <>
                        <MenuItem><a>Logged in as {user.username}</a></MenuItem>
                        <MenuItem onClick={handleEditProfile}><a>Edit Profile</a></MenuItem>
                      </>
                    }
                    <MenuItem onClick={handleAuth}>
                    <a>
                      {!token ? 'Sign In' : 'Sign Out'}
                      </a>
                    </MenuItem>
                  </Menu>
                </>
                :
                <Button variant='text' onClick={openProfileMenu}>
                  <div><a href="/sign-in">Sign In</a></div>
                </Button>
              }
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
