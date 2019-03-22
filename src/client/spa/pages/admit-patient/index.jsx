import {h, Component} from 'preact'
import M from 'materialize-css'

import HealthHistory from './health-history'

class CreateHistory extends Component {
	constructor() {
		super()
		this.state = {}
	}

	componentDidMount() {
		M.Collapsible.init(this.collapsible);
	}

	render() {
		console.log('shit niggy')
		return (
			<ul className="collapsible" ref={c => this.collapsible = c}>
				<li className="active">
					<div className="collapsible-header">Patient Health History</div>
					<div className="collapsible-body"><HealthHistory /></div>
				</li>
				<li>
					<div className="collapsible-header">Medication</div>
					<div className="collapsible-body"></div>
				</li>
				<li>
					<div className="collapsible-header"></div>
					<div className="collapsible-body"></div>
				</li>
				<li>
					<div className="collapsible-header"></div>
					<div className="collapsible-body"></div>
				</li>
			</ul>
		)
	}
}

export default CreateHistory
