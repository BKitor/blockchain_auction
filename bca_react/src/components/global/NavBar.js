import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Fade from '@material-ui/core/Fade';
import Util from '../../util.js'

import '../../styles/nav.css';
import { Button } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  const [token, ] = Util.checkSignedIn();
  const classes = useStyles();
  const [setQuery] = useState('');
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
      window.location = '/signin'
    } else {
      Util.singOut();
      window.location = '/signin'
    }
  }

  const handleSealed = () => {
    setAnchorAuctions(null);
    window.location = '/sealed-bid'
  }

  const handleEnglish = () => {
    setAnchorAuctions(null);
    window.location = '/english-bid'
  }

  const handleCloseAuctions = () => {
    setAnchorAuctions(null);
  };

  const handleViewAuctions = () => {
    setAnchorAuctions(null);
    window.location = '/auctions'
  }

  /* Search Callbacks */
  const handleSearch = (e) => {
    setQuery(e.target.value);
  }

  const handleSubmit = () => {
    alert('YEET');
  }


  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to='/'>BlockChain Auctions</Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearch}

              onSubmit={() => { handleSubmit() }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <div className="container">
              {/* Profile Dropdown */}
              <Button variant='text' onClick={openProfileMenu}>
                <div>Profile</div>
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={anchorProfile}
                keepMounted
                open={openProfile}
                onClose={handleCloseProfile}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={handleAuth}>
                  {!token ? 'Sign In' : 'Sign Out'}
                </MenuItem>
              </Menu>

              {/* Auctions Dropdown */}
              <Button variant='text' onClick={openAuctionMenu}>
                <div>Auctions</div>
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={anchorAuctions}
                keepMounted
                open={openAuctions}
                onClose={handleCloseAuctions}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleSealed}>Sealed Bid</MenuItem>
                <MenuItem onClick={handleEnglish}>English Bid</MenuItem>
                <MenuItem onClick={handleViewAuctions}>View Auctions</MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
