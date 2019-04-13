import {h, Component} from 'preact'
import cloneDeep from 'lodash/cloneDeep'
import {Loader} from '../Partial'
import {fhirBase} from '../util'

import '../styles/permissions.scss'
import Axios from 'axios'

class Permissions extends Component {
	constructor() {
		super()
		this.state = {
			practitioners: [], // practitioner list from API (Bundle resourceType)
			patients: [], // patient list by encounter from API
			selectedPractitioner: null,
			loaded: false,
		}
		// bind setPractitioner so the returned arrow func has `this` bound to instance of Permissions
		// ensures that if a child component is used, the correct state is updated
		this.setPractitioner = this.setPractitioner.bind(this)
	}

	async componentDidMount() {
		const [{data: practitioners}, {data: patients}] = await Promise.all([
			fhirBase.get('/Practitioner'),
			fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient;location'),
		])
		console.log({practitioners, patients})
		this.setState({
			practitioners,
			patients,
			selectedPractitioner: null,
			// deep clone because the method will be acting on the objects underneath
			oldPatients: cloneDeep(patients),
			loaded: true})
	}

	setPractitioner(id) {
		return async () => {
			// fetch union table from permissions API
			// sadly FHIR has poor support for permissions
			const {data} = await Axios.get(`/permissions/${id}`)
			const patientIDs = data.map(datum => datum.patient_id)
			console.log(data)
			console.log(this.state.patients)
			const patients = cloneDeep(this.state.oldPatients)
			// elems in matches are objects and thus handlded by ref
			// they can be given a 'grouped' attr
			const matches = patients.filter(patient => patientIDs.includes(patient.subject.id))
			matches.map(match => match.grouped = true)
			// data.forEach((pairing) => {
			// 	console.log(pairing)
			// 	patients.forEach((patient) => {
			// 		patient.grouped = (patient.subject.id === pairing.patient_id)
			// 	})
			// })
			this.setState({selectedPractitioner: id, patients})
		}
	}

	makeGrouping(patientID, grouped = false) {
		return async () => {
			if (!this.state.selectedPractitioner) return false
			const baseUrl = grouped ? 'destroy' : 'create'
			const resp = await Axios.post(`/permissions/${baseUrl}`, {
				patientID,
				practitionerID: this.state.selectedPractitioner,
			})
			const oldID = this.state.selectedPractitioner
			await this.componentDidMount()
			return this.setPractitioner(oldID)()
		}
	}

	renderPractitioners() {
		return this.state.practitioners.entry.map(practitioner => (
			<li
				onClick={this.setPractitioner(practitioner.id)}
				key={practitioner.telecom[0].value}
				className={`collection-item hover practitioner ${this.state.selectedPractitioner === practitioner.id ? 'selected' : ''}`}
			>
				<span className="title">Name: {practitioner.name[0].given[0]}</span>
				<p>Username: {practitioner.telecom[0].value}</p>
			</li>
		))
	}

	renderPatients() {
		return this.state.patients.map(patient => (
			<li
				key={patient.subject.id}
				className={`collection-item hover patient ${patient.grouped ? 'selected' : ''}`}
				onClick={this.makeGrouping(patient.subject.id, patient.grouped)}
			>
				<span className="title">{patient.subject.name[0].text}</span>
				<p>{patient.location[0].name}</p>
			</li>
		))
	}

	render() {
		if (!this.state.loaded) return <Loader />
		return (
			<div className="row permissions-table">
				<div className="col s6">
					<ul className="collection">{this.renderPractitioners()}</ul>
				</div>
				<div className="col s6">
					<ul className="collection">{this.renderPatients()}</ul>
				</div>
			</div>
		)
	}
}

export default Permissions
