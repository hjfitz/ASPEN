import {h, render, Component} from 'preact'
import {Router} from 'preact-router'

import {getJwtPayload, showLogin} from './util'

import {Fab, Breadcrumb, Redirect, Modal, Login} from './Partial'

import {
	SearchPatient,
	AdmitPatient,
	ViewPatient,
	Permissions,
	CreateWard,
	WardList,
	Home,
	ViewWard,
	Add,
} from './Pages'

import 'materialize-css/sass/materialize.scss'
import './styles/router.scss'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {location: window.location.pathname}
		this.onChange = this.onChange.bind(this)
		this.login = <Login />
		this.showPopup = showLogin
	}

	componentDidMount() {
		// 1. get token (if exists) from url and store it
		const location = new URL(window.location)
		const jwt = location.searchParams.get('token')
		if (jwt) {
			console.log('storing JWT')
			localStorage.setItem('token', jwt)
		}

		// 2. ensure that there is a token in storage
		const toCheck = jwt || localStorage.getItem('token')
		if (!toCheck) return this.showPopup()

		// 3. if token in storage, ensure it is fresh
		const {exp} = getJwtPayload(toCheck)
		if ((exp * 1000) < Date.now()) return this.showPopup()

		return true // keep eslint happy
	}

	onChange(ev) {
		this.setState({location: ev.url})
	}

	render() {
		return (
			<div className="container">
				<Breadcrumb location={this.state.location} />
				<Router onChange={this.onChange}>
					<Home path="/" />
					<WardList path="/wards" />
					<ViewWard path="/wards/:ward_id" />
					<Permissions path="/permissions" />
					<Add path="/add" />
					<CreateWard path="/add/ward" />
					<AdmitPatient path="/add/patient" />
					<SearchPatient path="/search/patient" />
					<Redirect path="/patient" to="/search/patient" />
					<ViewPatient path="/patient/:patient_id" />
				</Router>
				<Fab />
				<Modal />
				{this.login}
			</div>
		)
	}
}

render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
