import React, {Component} from 'react';
import axios from 'axios';
import Establishment from './Establishment';


export default class SearchResults extends Component{
	constructor(props){
		super(props);
		this.state = {
			city: this.props.city,
			bars: this.props.bars,
			data: this.props.data
		}
	}

	// componentWillReceiveProps(nextProps){
	// 	if(this.props !== nextProps){
	// 		this.setState = nextProps;
	// 	}
	// }

	createEstabs(){
		if(this.state.bars){
			return this.state.bars.map(est=>{
				return <Establishment key={est.id} about={est} user={this.props.user} data={this.state.data}/>
			})
		} else {
			return <div>Loading</div>
		}
	}

	render(){
		return(
			<div className='searchResultsContainer'>
				{this.createEstabs()}
			</div>
		)
	}
}