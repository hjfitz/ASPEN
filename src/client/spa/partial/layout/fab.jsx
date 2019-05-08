import {h, Component} from 'preact'
import {Link} from 'preact-router'
import M from 'materialize-css'

import {showLogin} from '../../util'

function logout(ev) {
	ev.preventDefault()
	console.log('oioi')
	localStorage.removeItem('token')
	showLogin()
}


class Fab extends Component {
	/**
	 * initialise floating action buttons
	 */
	componentDidMount() {
		const tipped = document.querySelectorAll('.tooltipped')
		const fab = document.querySelectorAll('.fixed-action-btn')
		M.FloatingActionButton.init(fab)
		M.Tooltip.init(tipped)
	}

	/**
	 * render a FAB
	 * @returns {VNode}
	 */
	render() {
		return (
			<div className="fixed-action-btn">
				<a className="btn-floating btn-large">
					<i className="large material-icons">menu</i>
				</a>
				<ul>
					<li>
						<Link href="/wards" className="btn-floating blue tooltipped" data-position="left" data-tooltip="View wards">
							<i className="material-icons">local_hospital</i>
						</Link>
					</li>
					<li>
						<Link href="/add/patient" className="btn-floating green tooltipped" data-position="left" data-tooltip="Admit a patient">
							<i className="material-icons">assignment_ind</i>
						</Link>
					</li>
					<li>
						<Link href="/search/patient" className="btn-floating yellow darken-3 tooltipped" data-position="left" data-tooltip="Search for a patient">
							<i className="material-icons">search</i>
						</Link>
					</li>
					<li>
						<Link href="/" className="btn-floating red tooltipped" data-position="left" data-tooltip="Go home">
							<i className="material-icons">home</i>
						</Link>
					</li>
					<li>
						<a onClick={logout} href="/" className="btn-floating blue-grey" data-position="left" data-tooltip="Logout">
							<i className="material-icons">input</i>
						</a>
					</li>
				</ul>
			</div>
		)
	}
}
export default Fab
