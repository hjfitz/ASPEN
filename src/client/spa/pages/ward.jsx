import {h, Component} from 'preact'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import {MINUTE, HALF_HOUR} from '../../util'
import './ward.scss'

const patients = [
	{id: 1, surname: 'Fitzgerald', firstname: 'Harry', nextObs: new Date()},
	{id: 2, surname: 'Fitzgerald', firstname: 'George', nextObs: new Date(Date.now() + HALF_HOUR)},

]

class Ward extends Component {
	constructor() {
		super()
		this.state = {
			patients: [],
			showPatient: false,
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

	showDetails(patient) {
		// should probs fetch from API and populate other readings
		return () => {
			this.setState({
				showPatient: true,
				patient: patient.id,
				patientDetalis: patient,
			})
		}
	}

	generatePatientList() {
		return this.state.patients.map((patient, idx) => {
			const next = () => distanceInWordsToNow(new Date(patient.nextObs), {addSuffix: true})
			let ref = this.patients[idx]
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
						<span className="obs-time" ref={(div) => { ref = div }}>{next()}</span>
					</div>
				</div>
			)

			// update the status in realtime
			const upd = () => { ref.textContent = next() }
			this.intervals.push(upd, MINUTE)

			return patientDOM
		})
	}

	submit() {
		console.log(arguments)
	}


	render() {
		const {wardName} = this.props.matches
		const header = <h1>Ward: {decodeURIComponent(wardName)}</h1>
		const patientInfo = (
			<section className="ward-input">
				<div>
					<label htmlFor="resp">Respiration Rate (BPM)
						<input type="number" id="resp" name="resp" required />
					</label>
				</div>

				<div>
					<label htmlFor="oxy-sat">Oxygen Saturation %
						<input type="number" id="oxy-sat" name="oxy-sat" required />
					</label>
				</div>

				<div>
					<label htmlFor="oxy-supp">Supplemental Oxygen
						<input type="number" id="oxy-supp" name="oxy-supp" required />
					</label>
				</div>
				<div>
					<label htmlFor="temp">Temperature °C
						<input type="number" id="temp" name="temp" required />
					</label>
				</div>
				<div>
					<label htmlFor="bp">Blood Pressure (mmHg)
						<input type="number" id="bp" name="bp" required />
					</label>
				</div>
				<div>
					<label htmlFor="h-rate">Heart Rate (BPM)
						<input type="number" id="h-rate" name="h-rate" required />
					</label>
				</div>
				<div>
					<label htmlFor="consc">Level of Consciousness
						<input type="string" id="consc" name="consc" required />
					</label>
				</div>
				<span className="btn" onClick={this.submit}>submit</span>

			</section>
		)
		return (
			<div>
				{header}
				<main className="ward">
					<aside className="ward-menu">
						{this.generatePatientList()}
					</aside>
					{this.state.showPatient ? patientInfo : ''}
				</main>
			</div>
		)
	}
}

export default Ward
