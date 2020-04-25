import React from 'react';
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import Home from './pages/Home';
import Compare from './pages/Compare';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div>
      <HashRouter basename='/'>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/compare/:name/:donated/:earn" component={Compare} />
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
