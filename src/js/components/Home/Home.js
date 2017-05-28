import React, { Component } from 'react';
import 'whatwg-fetch';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
		};

		this.clickFunction = this.clickFunction.bind(this);

	}
	clickFunction(){
		console.log(this)
		alert('sup') 
	}
	render() {
		return (
				<div>
					<p>Home</p>	
					<button onClick={this.clickFunction}>Yo</button>
				</div>
		       );
	}
}

export default Home;
