import {h, Component} from 'preact'
import {Link} from 'preact-router'

class Patient extends Component {
	render() {
		return (
			<div>
				<Link href="/ward">try route</Link>
				<h1>patient</h1>
			</div>
		)
	}
}

export default Patient
