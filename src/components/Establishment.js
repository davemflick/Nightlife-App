import React, { Component } from 'react';

export default class Establishment extends Component{
	constructor(props){
		super(props);
	}

	returnCityId(){
		this.props.data.forEach(city=>{
			if(city.city === this.props.about.city){
				this.setState({id: city._id})
			}
		})
	}

	findUserInEstabs(){
		let userGoing = false;
		this.props.about.peopleGoing.forEach(person=>{
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
		if(!userGoing && user !== undefined && user !== 'noUser'){
			return(
				<form action={'/add-user/' + id + '/' + user + '/' + estab + '?_method=PUT'} method='post'>
				    <input type='hidden' value={user} name='peopleGoing' />
					<input className='btn btn-warning' type='submit' value='Going?'/>
				</form>
			)
		} else {
			return (
				<div>
				  <h4> YOU"RE GOING </h4>
				  {this.removeFromGoing()}
				</div>
			)
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

	removeFromGoing(){
		let id;
		let bar = this.props.about.id;
		let user = this.props.user;
		this.props.data.forEach(city=>{
			if(city.city === this.props.about.city){
				id = city._id;
			}
		})
		return (
			<form action={'/remove/'+id+'/'+user+'/'+bar+'?_method=PUT'} method='post'>
				<input type='submit' className='btn btn-danger' value='Cancel?' />
			</form>
		)
	}

	renderListOfPeople(){
		let people = this.props.about.peopleGoing;
		if(people.length > 0){
			let list = '';
			for( let i=0; i<people.length; i++){
				i === people.length - 1 ? 
				list += ( '@'+people[i]):
				list += ('@'+people[i] + ', ');
			}
			return (<div>
				<h3> People Going </h3>
				<p>{list}</p>
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
							<div className='goingContainer'>
									{this.renderListOfPeople()}
							</div>
							<div className='userGoing'>
								{this.renderIfGoing()}
							</div>
						</div>
					</div>
			</div>
		)
	}
}