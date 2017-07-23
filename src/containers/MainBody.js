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
		
	}

	componentDidMount(){
		axios.get('/api/results').then((res)=>{
			let cityArray = res.data.city;
			let targetIndex = cityArray.length - 1
			let city = cityArray[targetIndex];
			this.setState({
				bars: city.results,
				city:city.city
			})
		}).catch((err)=>{
			console.log(err)
		});
	}


	render(){
		return(
			<div className='mainBodyContainer container'>
				<SearchBar />
				<Router>
					<Switch>
						<Route path={'/results/' + this.state.city} 
							   render={(props)=>
							   	<SearchResults city={this.state.city} bars={this.state.bars}/>
							   } />
					</Switch>
				</Router>
			</div>
		)
	}
}