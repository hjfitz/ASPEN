import {h, Component} from 'preact'
import M from 'materialize-css'
import {Loader, Vitals} from '../Partial'
import {fhirBase, doModal, toTitle} from '../util'
import WarningScore from '../WarningScore'

/**
 * Normalise api response for ease of manipulation in this component
 * @param {object} fhirResponse API response
 * @returns {object} normalised fhir response
 */
const normalisePatientInfo = (fhirResponse) => {
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
 * makes the fhir response easier to work with
 * @param {object[]} patReport Patient diagnostic report fro fhir api
 * @returns {object[]} formatted object: [{oxygen_saturation: 11, body_temp: 37 ...}]
 */
const normalisePatientReports = patReport => patReport
	.map(report => ({
		...report.result.reduce((acc, cur) => {
			acc[cur.code.text] = cur.valueQuantity.value
			return acc
		}, {}),
		date: new Date(report.meta.lastUpdated)}
	))


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

		const patientInfo = normalisePatientInfo({...data[0].subject, ...data[0].location[0]})
		const patientReports = normalisePatientReports(patientReport) // comes pre-sorted from API
		const ews = new WarningScore(patientReports[0])
		this.setState({
			patientInfo,
			loaded: true,
			patientReports,
			news: ews.score(),
		})
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
			const patientReports = normalisePatientReports(patientReport)
			const ews = new WarningScore(patientReports[0])
			this.setState({
				loaded: true,
				patientInfo: this.state.patientInfo,
				patientReports,
				news: ews.score(),
			})
		} catch (err) {
			console.error(err.response)
			doModal('Error', `There was an error submitting this report:</p><p>${err}</p>`)
		}
	}

	/**
	 * ? Keep an eye on `history.back`, see if it malfunctions
	 */
	async delete() {
		const {data} = await fhirBase.delete(`/Patient/${this.props.patient_id}`)
		const sev = data.issue[0].severity
		doModal(toTitle(sev), data.issue[0].details.text)
		if (sev === 'success') window.history.back()
	}

	/**
	 * Render our patient info
	 * @returns {VNode} patient information or loading icon
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		const {patient, contact} = this.state.patientInfo
		return (
			<div className="row">
				<div className="col s12">
					<div className="card horizontal">
						<div className="card-image">
							<img alt={patient.displayName} src={patient.photo || '/img/patient-placeholder.webp'} />
						</div>
						<div className="card-stacked">
							<div className="card-content">
								<i className="material-icons right clickable" onClick={this.delete.bind(this)}>close</i>
								<span className="card-title">{patient.displayName}</span>
								<p><b>Gender: </b>{patient.gender}</p>
								<p><b>Ward: </b>{patient.location}</p>
								<p><b>NEWS: </b>{this.state.news}</p>
								<p><b>Contact Name: </b>{contact.displayName}</p>
								<p><b>Contact Number: </b>{contact.number}</p>

							</div>
						</div>
					</div>
				</div>
				<div className="col s12">
					<Vitals submit={this.submitVitals} history={this.state.patientReports} />
				</div>
			</div>
		)
	}
}

export default Patient
