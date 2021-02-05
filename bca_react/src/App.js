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
import Auctions from './components/Auctions';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import SealedBid from './components/SealedBid';
import PlaceSealedBid from './components/PlaceSealedBid';
import ProfileByUname from './components/ProfileByUname';
import WithdrawSealedBid from './components/WithdrawSB.js'
import PlaceEnglish from './components/PlaceEnglish.js';
import English from './components/English.js';


function App() {
  return (
    <div>
      {/* Move NavBar and Footer to be global (not included in router switch) */}
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/auctions" component={Auctions} />
          <Route exact path="/withdraw/sealed-bid/:auction_pk" component={WithdrawSealedBid} />

          <Route exact path="/signin" component={Signin} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user/:uname" component={ProfileByUname} />

          <Route exact path='/sealed-bid' component={SealedBid} />
          <Route exact path="/place/sealed-bid/:auction_pk" component={PlaceSealedBid} />
          <Route exact path='/english' component={English} />
          <Route exact path="/place/english/:auction_pk" component={PlaceEnglish} />

          <Route exact path="/auctions" component={Auctions} />

          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
