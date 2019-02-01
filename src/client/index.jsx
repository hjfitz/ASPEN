import {h, render, Component} from 'preact'
import {Router} from 'preact-router'
import M from 'materialize-css'

import {Fab} from './spa/Partial'

import {
	SearchPatient,
	CreatePatient,
	CreateWard,
	WardList,
	Welcome,
	Ward,
} from './spa/Pages'

import 'materialize-css/sass/materialize.scss'
import './spa/styles/router.scss'

class App extends Component {
	componentDidMount() {
		// checkAuth({url: window.location.pathname})
		M.AutoInit()
	}

	componentDidUpdate() {
		M.AutoInit()
	}

	render() {
		return (
			// <Router onChange={checkAuth}>
			<div className="container">
				<Router>
					<Welcome path="/" />
					<WardList path="/wards" />
					<Ward path="/ward/:ward_id" />
					<CreateWard path="/create/ward" />
					<CreatePatient path="/create/patient" />
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
