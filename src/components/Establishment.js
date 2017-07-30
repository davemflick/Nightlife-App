import React, { Component } from 'react';

export default class Establishment extends Component{
	constructor(props){
		super(props);
		console.log("inside estbs")
	}

	componentWillReceiveProps(nextProps){
		if(this.props !== nextProps){
			console.log(this.props, nextProps)
		}
	}

	findUserInEstabs(){
		let userGoing = false;
		console.log(this.props.about)
		this.props.about.peopleGoing.forEach(person=>{
			console.log('Person: ' + person + ' props.user: ' + this.props.user)
			if(person === this.props.user){
				userGoing = true;
			}
		})
		return userGoing
	}

	determineButtonRender(){
		let userGoing = this.findUserInEstabs();
		let user = this.props.user;
		let estab = this.props.about.id
		let id;
		this.props.data.forEach(city=>{
			if(city.city === this.props.about.city){
				id = city._id;
			}
		})

		if(!userGoing){
			return(
				<form onSubmit={()=> e.preventDefault()} action={'/add-user/' + id + '/' + user + '/' + estab + '?_method=PUT'} method='post'>
					<button className='btn btn-warning' type='submit'> Going? </button>
				</form>
			)
		} else {
			return <h4> YOU"RE GOING </h4>
		}
	}

	renderIfGoing(){
		this.determineButtonRender()
		let user = this.props.user;
		if(user !== '' && user !== 'noUser'){
			return this.determineButtonRender();
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