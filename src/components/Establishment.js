import React, { Component } from 'react';

export default class Establishment extends Component{


	render(){
		return(
			<div className='estabCont'>
				<h1>{this.props.about.name}</h1>
				<img src={this.props.about.image} />
			</div>
		)
	}
}