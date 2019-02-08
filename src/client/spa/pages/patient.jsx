import {h, Component} from 'preact'
import M from 'materialize-css'
import {Loader, Vitals} from '../Partial'
import {fhirBase, doModal} from '../../util'

/**
 * Normalise api response for ease of manipulation in this component
 * @param {object} fhirResponse API response
 * @returns {object} normalised fhir response
 */
const normaliseFhirResponse = (fhirResponse) => {
	const {
		contact: [contact],
		photo: [photo],
		name: [name],
		id,
		gender,
		reference,
	} = fhirResponse
	return ({
		patient: {
			displayName: `${name.prefix} ${name.text}`,
			photo: photo ? photo.url : '',
			id,
			gender,
			location: reference,
		},
		contact: {
			displayName: `${contact.name.prefix} ${contact.name.text}`,
			number: contact.telecom[0].value,
		},

	})
}

/**
 * Hit /Diagnostics for list of 10 most recent patient reports
 * @param {number} id patient ID
 * @param {number} pageNo which page number to visit
 * @returns {AxiosPromise<any>} request to API
 */
const getPatientReport = (id, pageNo = 0) => fhirBase.get(
	`Diagnostics?patient=${id}`
	+ '&result=true'
	+ '&_count=10'
	+ `&pageNo=${pageNo}`,
)

class Patient extends Component {
	/**
	 * Patient information component
	 * @param {object} props component props
	 */
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			patientInfo: null,
			pageNo: 0,
		}
		this.submitVitals = this.submitVitals.bind(this)
	}

	/**
	 * fetch patient data from /Encounter on form load
	 */
	async componentDidMount() {
		const {patient_id: id} = this.props
		const [{data}, {data: patientReport}] = await Promise.all([
			fhirBase.get(`Encounter?class=admission&patient_id=${id}&_include=Encounter:patient`),
			getPatientReport(id, this.state.pageNo),
		])
		console.log(data[0])
		const patientInfo = normaliseFhirResponse({...data[0].subject, ...data[0].location[0]})
		this.setState({patientInfo, loaded: true, patientReport})
	}


	/**
	 * Submit data to API and repopulate vital chart
	 * @param {FormData} diagnosticReport fields in <vitals />
	 */
	async submitVitals(diagnosticReport) {
		diagnosticReport.append('patient_id', this.props.patient_id)
		try {
			const {data} = await fhirBase.post('/Diagnostics', diagnosticReport)
			M.toast({html: data.details.text})
			const {data: patientReport} = await getPatientReport(this.props.patient_id, this.state.pageNo)
			this.setState({
				loaded: true,
				patientInfo: this.state.patientInfo,
				patientReport,
			})
		} catch (err) {
			console.error(err.response)
			doModal('Error', `There was an error submitting this report:</p><p>${err}</p>`)
		}
	}

	/**
	 * Render our patient info
	 * @param {object} _ props (unused)
	 * @param {object} state component state
	 * @returns {VNode} patient information or loading icon
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		const {patient, contact} = this.state.patientInfo
		console.log(patient)
		return (
			<div className="row">
				<div className="col s12">
					<div className="card horizontal">
						<div className="card-image">
							<img alt={patient.displayName} src={patient.photo} />
						</div>
						<div className="card-stacked">
							<div className="card-content">
								<span className="card-title">{patient.displayName}</span>
								<p><b>Gender: </b>{patient.gender}</p>
								<p><b>Ward: </b>{patient.location}</p>
								<p><b>NEWS: </b>Fucked</p>
								<br />
								<p><b>Contact Name: </b>{contact.displayName}</p>
								<p><b>Contact Number: </b>{contact.number}</p>

							</div>
						</div>
					</div>
				</div>
				<div className="col s12">
					<Vitals submit={this.submitVitals} history={this.state.patientReport} />
				</div>
			</div>
		)
	}
}

export default Patient
