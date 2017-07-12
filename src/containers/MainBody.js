import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import SearchResults from '../components/SearchResults';


export default class MainBody extends Component{


	render(){
		return(
			<div className='mainBodyContainer'>
				<div className='searchFormContainer'>
					<form action='/search' method='post'>
						<div className='form-group'>
							<label>Search City</label>
	    					<input  type="search" className="form-control" name='location' placeholder="City, State" />
						</div>
						<button type='submit' className='btn btn-primary'>Search</button>
					</form>
				</div>
				<Router>
					<Switch>
						<Route path='/results/*' component={SearchResults} />
					</Switch>
				</Router>
			</div>
		)
	}
}