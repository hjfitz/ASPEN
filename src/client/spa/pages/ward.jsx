import {h, Component} from 'preact'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import {MINUTE, HALF_HOUR} from '../../util'
import {SubmissionScreen} from '../partial/Ward'
import './ward.scss'


// should suffice for an API call (for now)
const patients = [
	{id: 1, title: 'Mr', surname: 'Fitzgerald', firstname: 'Harry', nextObs: new Date()},
	{id: 2, title: 'Dr', surname: 'Fitzgerald', firstname: 'George', nextObs: new Date(Date.now() + HALF_HOUR)},

]

class WardPage extends Component {
	constructor() {
		super()
		this.state = {
			patients: [],
			showPatient: false,
			viewPastInfo: false,
		}
		this.intervals = []
		this.patients = {}
		this.submit = this.submit.bind(this)
	}

	componentDidMount() {
		// normally go to an endpoint and get the patients - but no data yet!
		// fetch('/fhir/patients').then(() => {})
		this.setState({patients})
	}

	componentWillUnmount() {
		// remove all intervals
		// chances are the next Ward monuted will get the same this.patient[idx]
		while (this.intervals.length) {
			clearInterval(this.intervals.pop())
		}
	}

	showDetails(patient) {
		// should probs fetch from API and populate other readings
		return () => {
			this.setState({
				showPatient: true,
				patient: patient.id,
				patientDetails: patient,
				viewPastInfo: false,
			})
		}
	}

	generatePatientList() {
		return this.state.patients.map((patient, idx) => {
			// make this look better, make the time to next obs colored
			const next = () => `Next due: ${distanceInWordsToNow(new Date(patient.nextObs), {addSuffix: true})}`
			let classList = 'ward_patient'
			if (this.state.patient === patient.id) {
				classList += ' active'
			}
			const patientDOM = (
				<div className={classList} onClick={this.showDetails(patient)}>
					<div className="ward_patient--info">
						<h2 className="ward_patient--name">{patient.surname}, {patient.firstname}</h2>
					</div>
					<div className="ward_patient--obs">
						<span className="obs-time" ref={(div) => { this.patients[idx] = div }}>{next()}</span>
					</div>
				</div>
			)

			// update the status in realtime
			this.intervals.push(setInterval(() => {
				this.patients[idx].textContent = next()
			}), MINUTE)

			return patientDOM
		})
	}

	submit() {
		// make a POST
		console.log(this, arguments)
	}

	toggleDetails(viewPastInfo = false) {
		return () => {
			this.setState({viewPastInfo})
		}
	}

	displayPatient() {
		const {surname, title} = this.state.patientDetails
		let inner
		if (this.state.viewPastInfo) {
			inner = this.displayPatientDetails()
		} else {
			inner = (
				<SubmissionScreen
					surname={surname}
					title={title}
					submit={this.submit}
					ref={(ss) => { this.sub = ss }}
				/>
			)
		}
		return (
			<div className="patient">
				<ul className="patient_toggle">
					<li onClick={this.toggleDetails()}>Submit Details</li>
					<li onClick={this.toggleDetails(true)}>View Past</li>
				</ul>
				{inner}
			</div>
		)
	}


	displayPatientDetails() {
		// should make an API request and store them
		return (
			<h1>oi</h1>
		)
	}


	render() {
		const {wardName} = this.props.matches
		const header = <h1>Ward: {decodeURIComponent(wardName)}</h1>

		return (
			<div>
				{header}
				<main className="ward">
					<aside className="ward-menu">
						{this.generatePatientList()}
					</aside>
					{this.state.showPatient ? this.displayPatient() : ''}
				</main>
			</div>
		)
	}
}

export default WardPage
