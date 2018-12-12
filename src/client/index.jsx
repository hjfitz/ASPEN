import {h, render, Component} from 'preact'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import {Router, route} from 'preact-router'

import {Ward, Patient} from './spa/Pages'

// routes that we should check the JWT or redir, for UX
const protectedRoutes = ['/ward']

// shallow check to ensure that there exists a valid token
function isAuthed() {
	const token = localStorage.getItem('token')
	if (!token) {
		return false
	}
	try {
		const payload64 = token.split('.')[1]
		const payload = Utf8.stringify(Base64.parse(payload64))
		const {exp} = JSON.parse(payload)
		const expired = new Date(exp * 1000) < new Date()
		return expired
	} catch (err) {
		return false
	}
}


function checkAuth({url}) {
	protectedRoutes.forEach((prot) => {
		if (!isAuthed() && url === prot) {
			route('/login', true)
		}
	})
}

class App extends Component {
	componentDidMount() {
		checkAuth({url: window.location.pathname})
	}

	render() {
		return (
			<Router onChange={checkAuth}>
				<Patient path="/" />
				<Ward path="/ward/:any" />
			</Router>
		)
	}
}

render(<App />, document.body)
