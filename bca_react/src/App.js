import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import NavBar from './components/NavBar';
import Home from './components/Home';
import Signin from './components/Signin';
import Auctions from './components/Auctions';
import Profile from './components/Profile';
import NotFound from './components/NotFound';

function App() {
  return (
    <div>
        {/* Move NavBar and Footer to be global (not included in router switch) */}
        <Router>
        <NavBar/>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/auctions" component={Auctions} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="*" component={NotFound} />
        </Switch>
        </Router>
    </div>
)
}

export default App;
