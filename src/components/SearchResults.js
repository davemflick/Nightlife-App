import React, {Component} from 'react';
import axios from 'axios';


export default class SearchResults extends Component{
	constructor(props){
		super(props);
		this.state= {};
		console.log(this.props)
	}

	componentWillUpdate(){
		console.log(this.props)
	}

	render(){
		return(
			<div className='searchResultsContainer'>
			</div>
		)
	}
}