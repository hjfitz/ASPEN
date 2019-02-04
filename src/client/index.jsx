import {h, render, Component} from 'preact'
import {Router} from 'preact-router'
import M from 'materialize-css'

import {Fab, Breadcrumb} from './spa/Partial'

import {
	SearchPatient,
	CreatePatient,
	CreateWard,
	WardList,
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
		// checkAuth({url: window.location.pathname})
		M.AutoInit()
	}

	componentDidUpdate() {
		M.AutoInit()
	}

	onChange(ev) {
		this.setState({location: ev.url})
	}

	render() {
		return (
			// <Router onChange={checkAuth}>
			<div className="container">
				<Breadcrumb location={this.state.location} />
				<Router onChange={this.onChange}>
					<Welcome path="/" />
					<WardList path="/wards" />
					<Ward path="/ward/:ward_id" />
					<Add path="/add" />
					<CreateWard path="/add/ward" />
					<CreatePatient path="/add/patient" />
					<SearchPatient path="/search/patient" />
					{/* <Patient path="/patient/:patient_id" /> */}
				</Router>
				<Fab />
			</div>
		)
	}
}

render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
