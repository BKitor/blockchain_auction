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
import Signin from './components/Signin';
import Auctions from './components/Auctions.js';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import SealedBid from './components/Auctions/SealedBid/SealedBid.js';
import PlaceSealedBid from './components/Auctions/SealedBid/PlaceSealedBid.js';
import ProfileByUname from './components/ProfileByUname';
import WithdrawSealedBid from './components/Auctions/SealedBid/WithdrawSB.js';
import PlaceEnglish from './components/Auctions/English/PlaceEnglish.js';
import English from './components/Auctions/English/English.js';
import WithdrawEnglish from './components/Auctions/English/WithdrawEnglish';
import Dutch from './components/Auctions/Dutch/Dutch.js';
import PlaceDutch from './components/Auctions/Dutch/PlaceDutch.js';
import WithdrawDutch from './components/Auctions/Dutch/WithdrawDutch.js'
import Channel from './components/Auctions/Channel/Channel.js'
import PlaceChannel from './components/Auctions/Channel/PlaceChannel.js'
import WithdrawChannel from './components/Auctions/Channel/WithdrawChannel.js'
import Squeeze from './components/Auctions/Squeeze/Squeeze.js'
import PlaceSqueeze from './components/Auctions/Squeeze/PlaceSqueeze.js'
import WithdrawSqueeze from './components/Auctions/Squeeze/WithdrawSqueeze.js'

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
          <Route exact path="/withdraw/english/:auction_pk" component={WithdrawEnglish} />

          <Route exact path='/auctions/dutch-bid' component={Dutch} />
          <Route exact path="/place/dutch/:auction_pk" component={PlaceDutch} />
          <Route exact path="/withdraw/dutch/:auction_pk" component={WithdrawDutch} />

          <Route exact path='/channel' component={Channel} />
          <Route exact path='/place/channel/:auction_pk' component={PlaceChannel} />
          <Route exact path='/withdraw/channel/:auction_pk' component={WithdrawChannel} />

          <Route exact path='/squeeze' component={Squeeze} />
          <Route exact path='/place/squeeze/:auction_pk' component={PlaceSqueeze} />
          <Route exact path='/withdraw/squeeze/:auction_pk' component={WithdrawSqueeze} />

          <Route exact path="/auctions" component={Auctions} />

          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
