import React from 'react';

import { Link } from 'react-router-dom';
//import { Router, Route, browserHistory, Switch, Link } from 'react-router'

const Header = () => (
  <header>

    <nav>
      <Link to="/">Home  </Link>
      <Link to="/helloworld">|  Hello World  </Link>
      <Link to="/map">|  Map  </Link>
      <Link to="/layout">|  Layout  </Link>
      
    </nav>
    <hr />
  </header>
);

export default Header;
