import {h, Component} from 'preact'
import M from 'materialize-css'

import HealthHistory from './health-history'
import OtherQuestions from './other'
import SignOff from './sign-off'
import Medication from './medication'
import Exercise from './exercise'
import Tobacco from './tobacco'
import Alcohol from './alcohol'
import Diet from './diet'
import Drugs from './drugs'

import '../../styles/patient-history.scss'

class CreateHistory extends Component {
	constructor() {
		super()
		this.state = {}
	}

	componentDidMount() {
		M.Collapsible.init(this.collapsible)
	}

	render() {
		return (
			<ul className="collapsible" ref={c => this.collapsible = c}>
				<li className="">
					<div className="collapsible-header">Patient Health History</div>
					<div className="collapsible-body"><HealthHistory /></div>
				</li>
				<li>
					<div className="collapsible-header">Medication</div>
					<div className="collapsible-body"><Medication /></div>
				</li>
				<li>
					<div className="collapsible-header">Exercise</div>
					<div className="collapsible-body"><Exercise /></div>
				</li>
				<li>
					<div className="collapsible-header">Dietary Habits</div>
					<div className="collapsible-body"><Diet /></div>
				</li>
				<li>
					<div className="collapsible-header">Alcohol Use</div>
					<div className="collapsible-body"><Alcohol /></div>
				</li>
				<li>
					<div className="collapsible-header">Tobacco Use</div>
					<div className="collapsible-body"><Tobacco /></div>
				</li>
				<li>
					<div className="collapsible-header">Drug Use</div>
					<div className="collapsible-body"><Drugs /></div>
				</li>
				<li>
					<div className="collapsible-header">Further Information</div>
					<div className="collapsible-body"><OtherQuestions /></div>
				</li>
				<li>
					<div className="collapsible-header">Sign Off</div>
					<div className="collapsible-body"><SignOff /></div>
				</li>
			</ul>
		)
	}
}

export default CreateHistory
