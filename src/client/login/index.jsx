import {h, render, Component} from 'preact'

import 'materialize-css/sass/materialize.scss'


class App extends Component {
	constructor() {
		super()
		const loginUrl = window.location.href.split('google_redir=')[1]
		console.log(loginUrl)
		this.state = {
			loginUrl,
			form: 'login',
		}
	}

	componentWillMount() {

	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col s12">
						<div className="card">
							<div className="card-content">
								<span className="card-title">Login</span>
								<a className="waves-effect waves-light btn white blue-text text-darken-1" href={this.state.loginUrl}>Login with Google</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
render(<App />, document.querySelector('[preact-root]'))
require('preact/debug')
