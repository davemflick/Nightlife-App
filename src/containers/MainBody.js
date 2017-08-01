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
		this.state = {}
		
	}

	componentDidMount(){
		axios.get('/api/results').then((res)=>{
			let loc = window.location.href;
			let city= '';
			for(var i=loc.length-1; i>0; i--){
				if(loc[i] === '/'){
					city = loc.slice(i+1).toLowerCase();
					break;
				}
			}
			let cityArray = res.data.city;
			let curCity;
			for(var i=0; i< cityArray.length; i++){
				if(cityArray[i].city === city.split(' ')[0]){
					curCity = cityArray[i];
					break;
				}
			}
			let myCity = {
				bars: curCity.results,
				city:city,
				data: cityArray
			};
			this.setState(myCity);
		}).catch((err)=>{
			console.log(err)
		});
	}

	componentWillReceiveProps(nextProps){
		if(this.props !== nextProps){
			this.setState({user: nextProps.user});
			console.log('nextprops', this.state)
		}
	}

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