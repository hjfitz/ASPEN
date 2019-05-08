import {h, Component} from 'preact'
import {Link} from 'preact-router'

import {Loader} from '../Partial'
import {fhirBase} from '../util'


class Ward extends Component {
	/**
	 * Render a ward with patient listing
	 * @param {preact.ComponentProps} props component properties
	 */
	constructor(props) {
		super(props)
		this.state = {
			wardData: undefined,
			loaded: false,
		}
	}

	/**
	 * fetch ward ID from props (in url)
	 * get data from /fhir/Encounter (as has location information)
	 * set state to ward data
	 */
	async componentDidMount() {
		const {ward_id} = this.props.matches
		const base = `/Encounter/?class=admission&location_id=${ward_id}&_include=Encounter:patient`
		const {data: wardData} = await fhirBase.get(base)
		this.setState({loaded: true, wardData})
	}

	/**
	 * take all patients for a ward (gotten in componentdidMount())
	 * render them in to a materialize collection after formatting data
	 * @returns {preact.VNode}
	 */
	renderPatients() {
		const mappedPatients = this.state.wardData
		// first round: format patient data to {name, image, id}
			.map((patient) => {
				/**
				 * pull data from patient
				 * originally has the form:
				 * {
				 *   subject:
				 *     {
				 *       name: [{name: text: {harry}}],
				 *       photo: somePhotoUrl,
				 *       id: 1
				 *     }
				 * }
				 */
				const {subject: {name: [name], photo, id}} = patient
				// create a display name
				const displayName = `${name.prefix[0]}. ${name.text}`
				const displayImage = photo.length ? photo[0].url : '/patient/unknown.png'
				return {
					id,
					name: displayName,
					image: displayImage,
				}
			})
			// put in to preact vnodes (components)
			.map(patient => (
				<Link href={`/patient/${patient.id}`} className="collection-item avatar">
					<img src={patient.image} alt="" className="circle" />
					<span className="title">{patient.name}</span>
				</Link>
			))
		return <div className="collection">{mappedPatients}</div>
	}

	/**
	 * render the patients within a ward
	 * @returns {preact.VNode}
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		return this.renderPatients()
	}
}

export default Ward
