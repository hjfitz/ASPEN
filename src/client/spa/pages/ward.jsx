import {h, Component} from 'preact'
import distanceInWords from 'date-fns/distance_in_words'
import {HALF_HOUR} from '../../util'
import './ward.scss'

const patients = [
	{surname: 'Fitzgerald', firstname: 'Harry', nextObs: new Date()},
	{surname: 'Fitzgerald', firstname: 'George', nextObs: new Date(Date.now() + HALF_HOUR)},

]

class Ward extends Component {
	constructor() {
		super()
		this.state = {
			patients: [],
		}
		this.intervals = []
		this.patients = {}
	}

	componentDidMount() {
		// normally go to an endpoint and get the patients - but no data yet!
		// fetch('/fhir/patients').then(() => {})
		this.setState({patients})
		console.log('mounted')
	}

	componentWillUnmount() {
		while (this.intervals.length) {
			clearInterval(this.intervals.pop())
		}
	}

	generatePatientList() {
		return this.state.patients.map((patient, idx) => {
			const next = () => distanceInWords(Date.now(), new Date(patient.nextObs))
			const patientDOM = (
				<div className="ward_patient">
					<div className="ward_patient--info">
						<h2 className="ward_patient--name">{patient.surname}, {patient.firstname}</h2>
					</div>
					<div className="ward_patient--obs">
						<span className="obs-time" ref={(div) => { this.patients[idx] = div }}>{next()}</span>
					</div>
				</div>
			)
			this.intervals.push(
				setInterval(() => { this.patients[idx].textContent = next() }, HALF_HOUR),
			)
			return patientDOM
		})
	}


	render() {
		const {wardName} = this.props.matches
		const header = <h1>{decodeURIComponent(wardName)}</h1>
		console.log(wardName)
		return (
			<div className="ward">
				{header}
				{this.generatePatientList()}
			</div>
		)
	}
}

export default Ward
