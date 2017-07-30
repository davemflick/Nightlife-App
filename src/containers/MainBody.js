import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import yelp from 'yelp-fusion';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Failed from '../components/Failed';


export default class MainBody extends Component{
	constructor(props){
		super(props);
		this.state = {
			bars: [],
			city: '',
			data: []
		}
		
	}

	componentDidMount(){
		axios.get('/api/results').then((res)=>{
			let cityArray = res.data.city;
			let targetIndex = cityArray.length - 1;
			let city = cityArray[targetIndex];
			let myCity = {
				bars: city.results,
				city:city.city,
				data: res.data.city
			};
			console.log('myCity', myCity)
			this.setState(myCity);
		}).catch((err)=>{
			console.log(err)
		});
	}

	// componentWillReceiveProps(nextProps){
	// 	if(this.props !== nextProps){
	// 		this.setState({user: nextProps.user});
	// 		console.log('nextprops', this.state)
	// 	}
	// }

	render(){
		return(
			<div className='mainBodyContainer container'>
				<SearchBar />
				<Router>
					<Switch>
						<Route path={'/failed-login'} component={Failed} />
						<Route path={'/results/' + this.state.city} 
							   render={(props)=>
							   	<SearchResults city={this.state.city} bars={this.state.bars} user={this.state.user} data={this.state.data}/>
							   } />
					</Switch>
				</Router>
			</div>
		)
	}
}