import {h, render, Component} from 'preact'
import {Router, route} from 'preact-router'

import {Ward, Patient, WardList} from './spa/Pages'
import {getJwtPayload} from './util'

// routes that we should check the JWT or redir, for UX
const protectedRoutes = ['/ward']

// shallow check to ensure that there exists a valid token
function isAuthed() {
	const payload = getJwtPayload()
	if (!payload) return false
	const {exp} = JSON.parse(payload)
	const expired = new Date(exp * 1000) < new Date()
	return expired
}


function checkAuth({url}) {
	console.log(`[CHECKAUTH] url: ${url}`)
	const needsAuth = protectedRoutes.filter(prot => url.indexOf(prot) === 0)
	console.log(`[CHECKAUTH] route: ${needsAuth}`)
	// if (needsAuth.length && !isAuthed) {
	// 	console.log('[CHECKAUTH] rediredirecting to auth')
	// 	route('/login')
	// }
}

class App extends Component {
	componentDidMount() {
		checkAuth({url: window.location.pathname})
	}

	render() {
		return (
			<Router onChange={checkAuth}>
				<WardList path="/" />
				<Ward path="/ward/:wardName" />
				<Patient path="/patient/:patientName" />
			</Router>
		)
	}
}

render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
