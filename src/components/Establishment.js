import React, { Component } from 'react';

export default class Establishment extends Component{
	constructor(props){
		super(props);
	}

	findUserInEstabs(){
		console.log(this.props.about)
	}

	renderIfGoing(){
		let user = this.props.user;
		console.log(this.props.about)
		if(user !== '' && user !== 'noUser'){
			return <button className='btn btn-warning'>Going?</button>
		} else {
			return (
				<div>
				<p> Login With
					<span><a href='/twitter/login'> Twitter </a></span>
				 to let your friends know you're going! </p>
				</div>
			)
		}
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
								{this.renderIfGoing()}
							</div>
						</div>
					</div>
			</div>
		)
	}
}