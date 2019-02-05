import {h, Component} from 'preact'
import {Loader, Vitals} from '../Partial'
import {fhirBase} from '../../util'

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
	} = fhirResponse
	return ({
		patient: {
			displayName: `${name.prefix} ${name.text}`,
			photo: photo.url,
			id,
		},
		contact: {
			displayName: `${contact.name.prefix} ${contact.text}`,
			number: contact.telecom[0].value,
		},

	})
}

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
		}
	}

	/**
	 * fetch patient data from /Encounter on form load
	 */
	async componentDidMount() {
		const {data} = await fhirBase.get(`Encounter/?class=admission&patient_id=${this.props.patient_id}&_include=Encounter:patient`)
		const patientInfo = normaliseFhirResponse(data[0].subject)
		this.setState({patientInfo, loaded: true})
	}

	/**
	 * Render our patient info
	 * @param {object} _ props (unused)
	 * @param {object} state component state
	 * @returns {VNode} patient information or loading icon
	 */
	render(_, state) {
		if (!state.loaded) return <Loader />
		return (
			<div className="row">
				<div className="col s12">
					<div className="card horizontal">
						<div className="card-image">
							<img alt={state.patientInfo.patient.displayName} src={state.patientInfo.patient.photo} />
						</div>
						<div className="card-stacked">
							<div className="card-content">
								<span className="card-title">{state.patientInfo.patient.displayName}</span>
								<p>I am a very simple card. I am good at containing small bits of information.</p>
							</div>
						</div>
					</div>
				</div>
				<div className="col s12">
					<Vitals />
				</div>
			</div>
		)
	}
}

export default Patient
