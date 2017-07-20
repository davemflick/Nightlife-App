import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import yelp from 'yelp-fusion';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';


export default class MainBody extends Component{
	constructor(props){
		super(props);
		this.state = {
			bars: [],
			city: ''
		}
		//axios.get('/results/Wilmington').then((res)=>{console.log(res.json)})
	}

	render(){
		return(
			<div className='mainBodyContainer'>
				<SearchBar />
				<Router>
					<Switch>
						<Route path={'/results/'} component={SearchResults} />
					</Switch>
				</Router>
			</div>
		)
	}
}