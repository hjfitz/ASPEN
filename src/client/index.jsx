import {h, render, Component} from 'preact'
import {Router} from 'preact-router'
import M from 'materialize-css'

import {Welcome, CreateWard, CreatePatient} from './spa/Pages'

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
					<CreateWard path="/create/ward" />
					<CreatePatient path="/create/patient" />
					{/* <Patient path="/patient/:patient_id" /> */}
					{/* <Ward path="/ward/:ward_id" /> */}
					{/* <Create path="/submit" /> */}
				</Router>
				<div className="fixed-action-btn">
					<a className="btn-floating btn-large red">
						<i className="large material-icons">mode_edit</i>
					</a>
					<ul>
						<li><a className="btn-floating red"><i className="material-icons">insert_chart</i></a></li>
						<li><a className="btn-floating yellow darken-1"><i className="material-icons">assignment_ind</i></a>
						</li>
						<li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
						<li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
					</ul>
				</div>
			</div>
		)
	}
}

render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
