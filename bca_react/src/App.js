import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import NavBar from './components/global/NavBar';
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


function App() {
  return (
    <div>
      {/* Move NavBar and Footer to be global (not included in router switch) */}
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/auctions" component={Auctions} />

          <Route exact path="/signin" component={Signin} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user/:uname" component={ProfileByUname} />

          <Route exact path='/sealed-bid' component={SealedBid} />
          <Route exact path="/place/sealed-bid/:auction_pk" component={PlaceSealedBid} />
          <Route exact path="/withdraw/sealed-bid/:auction_pk" component={WithdrawSealedBid} />

          <Route exact path='/english' component={English} />
          <Route exact path="/place/english/:auction_pk" component={PlaceEnglish} />
          <Route exact path="/withdraw/english/:auction_pk" component={WithdrawEnglish} />

          <Route exact path='/dutch' component={Dutch} />
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
