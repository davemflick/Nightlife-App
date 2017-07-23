import React, { Component } from 'react';

export default class Establishment extends Component{
	constructor(props){
		super(props);
	}


	render(){
		return(
			<div className='estabCont container'>
				<h1>{this.props.about.name}</h1>
					<div className='aboutCont'>
						<img className='img img-responsive img-rounded' src={this.props.about.image} />
						<div className='aboutEst '>
							<h4>{"Rating: " + this.props.about.rating}</h4>
							<h4>{"Price: " + this.props.about.price}</h4>
							<div className='address'>
								<h5>Address:</h5>
								<p className='addressStart'>{this.props.about.address[0]}</p>
								<p>{this.props.about.address[1]}</p>
							</div>
							<div className='whosGoing'>
								<button className='btn btn-warning'>Going?</button>
							</div>
						</div>
					</div>
			</div>
		)
	}
}