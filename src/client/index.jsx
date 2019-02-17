import {h, render, Component} from 'preact'
import {Router} from 'preact-router'

import {getJwtPayload} from './util'

import {Fab, Breadcrumb, Redirect, Modal} from './spa/Partial'

import {
	SearchPatient,
	CreatePatient,
	CreateWard,
	WardList,
	Patient,
	Welcome,
	Ward,
	Add,
} from './spa/Pages'

import 'materialize-css/sass/materialize.scss'
import './spa/styles/router.scss'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			location: window.location.pathname,
		}
		this.onChange = this.onChange.bind(this)
	}

	componentDidMount() {
		// 1. get token (if exists) from url and store it
		const location = new URL(window.location)
		const jwt = location.searchParams.get('token')
		if (jwt) localStorage.setItem('token', jwt)

		// 2. ensure that there is a token in storage
		const toCheck = jwt || localStorage.getItem('token')
		if (!toCheck) return window.location.href = '/login'

		// 3. if token in storage, ensure it is fresh
		const {iat, exp} = getJwtPayload(toCheck)
		const expiresAt = new Date((iat + exp) * 1000)
		if (expiresAt < Date.now()) return window.location.href = '/login'

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
					<Welcome path="/" />
					<WardList path="/wards" />
					<Ward path="/wards/:ward_id" />
					<Add path="/add" />
					<CreateWard path="/add/ward" />
					<CreatePatient path="/add/patient" />
					<SearchPatient path="/search/patient" />
					<Redirect path="/patient" to="/search/patient" />
					<Patient path="/patient/:patient_id" />
				</Router>
				<Fab />
				<Modal />
			</div>
		)
	}
}

render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
