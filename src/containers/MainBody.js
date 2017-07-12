import React, { Component } from 'react';
import SearchResults from '../components/SearchResults';
import axios from 'axios';

export default class MainBody extends Component{

	componentDidMount(){
		axios.get('https://api.yelp.com/v3/businesses/search')
			.then((res)=>{
				console.log(res)
			})
			.catch((err)=>{
				console.log(err)
			})
	}


	// callYelpAPI(){
	// 	axios.get('https://api.yelp.com/v3/businesses/search')
	// 		.then((res)=>{
	// 			console.log(res)
	// 		})
	// 		.catch((err)=>{
	// 			console.log(err)
	// 		})
	// }

	render(){
		return(
			<div className='mainBodyContainer'>
				<div className='searchFormContainer'>
					<form action='/' method='get'>
						<div className='form-group'>
							<label>Search City</label>
	    					<input type="search" className="form-control"placeholder="City, State" />
						</div>
						<button onClick={this.callYelpAPI} type='submit' className='btn btn-primary'>Search</button>
					</form>
				</div>
				<SearchResults />
			</div>
		)
	}
}