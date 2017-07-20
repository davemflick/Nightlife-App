import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Header from './Header';
import MainBody from './MainBody';
import axios from 'axios';

export default class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			bars: [],
			city: ''
		}

		axios.get('/results/:id').then((res)=>{console.log("Hello")})

	}


	render(){
		return(
		<div className='mainContainer'>
			<Header />
			<Router>
				<Switch>
					<Route path={'/results/' + this.state.city} component={MainBody} />
				</Switch>
			</Router>
		</div>
		)
	}
}