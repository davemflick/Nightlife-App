import React, {Component} from 'react';
import axios from 'axios';

export default class SearchResults extends Component{
	constructor(props){
		super(props);
		this.state={
			location: this.getLocation()
		}
	}

	getLocation(){
		let splitURL = window.location.href.split('/');
		return splitURL[splitURL.length-1]
	}

	componentDidMount(){
		axios.get('/results/' + this.state.location)
			.then((res)=>{
				console.log(res);
			}).catch(err=> console.log(err))
	}

	render(){
		return(
			<div className='searchResultsContainer'>
				{'Location = ' + this.state.location}
			</div>
		)
	}
}