import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import reducer from './reducers/reducer'
import Layout from "./components/Layout";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';
import Home from './components/Home/Home';

import HelloWorld from './components/HelloWorld/HelloWorld';
import SimpleMapExample from './components/Map/Map';



/*import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
 <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/helloworld" component={HelloWorld}/>
        <Route component={NotFound}/>
      </Switch>
    </App>
  </Router>
*/


/*
 *
 * 	<Provider store={store}>

	
		<MuiThemeProvider>	
			<Layout/>
		</MuiThemeProvider>
	</Provider>
*/
//import { Router, Route, browserHistory } from 'react-router'
//import { syncHistoryWithStore, routerReducer } from 'react-router-redux'



const app = document.getElementById('app')

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
 <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/helloworld" component={HelloWorld}/>
        <Route path="/map" component={SimpleMapExample}/>
        <Route path="/layout" component={()=>(
		<div>
      			<Provider store={store}>
				<MuiThemeProvider>	
					<Layout/>
				</MuiThemeProvider>
			</Provider>
		
		</div>)}/>
	
        <Route component={NotFound}/>
      </Switch>
      <Provider store={store}>

	
		<MuiThemeProvider>	
			<Layout/>
		</MuiThemeProvider>
	</Provider>

    </App>
    
  </Router>
		
	, app);
