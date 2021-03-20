import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// Global Imports
import NavBar from './components/global/NavBar';
import NotFound from './components/global/NotFound';

// Pages
import Home from './components/Home';

// Profile Pages
import Signin from './components/profile/Signin';
import Profile from './components/profile/Profile';
import ProfileByUname from './components/profile/ProfileByUname';

// Auction Pages
import Auctions from './components/Auctions/Auctions';
import SealedBid from './components/Auctions/SealedBid/SealedBid';
import English from './components/Auctions/English/English.js';
import Dutch from './components/Auctions/Dutch/Dutch.js';

import PlaceSealedBid from './components/PlaceSealedBid';
import WithdrawSealedBid from './components/WithdrawSB.js'
import PlaceEnglish from './components/PlaceEnglish.js';
import PlaceDutch from './components/PlaceDutch.js';
import WithdrawDutch from './components/WithdrawDutch.js';

import './styles/global.css';
import About from './components/about/About';
import AboutSealedBid from './components/about/SealedBid';
import AboutDutchBid from './components/about/DutchBid';
import AboutEnglishBid from './components/about/EnglishBid';

function App() {
document.documentElement.setAttribute('data-theme', 'dark');

  return (
    <div>
      {/* Move NavBar and Footer to be global (not included in router switch) */}
      <Router>
        <NavBar />
        <Switch>
          {/* Main Pages */}
          <Route exact path="/" component={Home} />
          <Route exact path="/auctions" component={Auctions} />

          {/* About Pages */}
          <Route exact path="/about" component={About} />
          <Route exact path="/about/sealed-bid" component={AboutSealedBid} />
          <Route exact path="/about/dutch-bid" component={AboutDutchBid} />
          <Route exact path="/about/english-bid" component={AboutEnglishBid} />

          {/* Profile Pages */}
          <Route exact path="/sign-in" component={Signin} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user/:uname" component={ProfileByUname} />

          {/* Auction Pages */}
          <Route exact path="/auctions" component={Auctions} />

          <Route exact path='/auctions/sealed-bid' component={SealedBid} />
          <Route exact path="/place/sealed-bid/:auction_pk" component={PlaceSealedBid} />
          <Route exact path="/withdraw/sealed-bid/:auction_pk" component={WithdrawSealedBid} />

          <Route exact path='/auctions/english-bid' component={English} />
          <Route exact path="/place/english/:auction_pk" component={PlaceEnglish} />

          <Route exact path='/auctions/dutch-bid' component={Dutch} />
          <Route exact path="/place/dutch/:auction_pk" component={PlaceDutch} />
          <Route exact path="/withdraw/dutch/:auction_pk" component={WithdrawDutch} />

          {/* Cannot be found */}
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
