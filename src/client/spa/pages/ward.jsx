import {h, Component} from 'preact'
import {Link} from 'preact-router'

import Loader from '../partial/loader'
import {fhirBase} from '../util'


class Ward extends Component {
	constructor(props) {
		super(props)
		this.state = {
			wardData: undefined,
			loaded: false,
		}
	}

	async componentDidMount() {
		const {ward_id} = this.props.matches
		const base = `/Encounter/?class=admission&location_id=${ward_id}&_include=Encounter:patient`
		const {data: wardData} = await fhirBase.get(base)
		this.setState({loaded: true, wardData})
	}

	renderPatients() {
		const mappedPatients = this.state.wardData
			.map((patient) => {
				const {subject: {name: [name], photo, id}} = patient
				const displayName = `${name.prefix[0]}. ${name.text}`
				const displayImage = photo.length ? photo[0].url : '/patient/unknown.png'
				return {
					id,
					name: displayName,
					image: displayImage,
				}
			})
			.map(patient => (
				<Link href={`/patient/${patient.id}`} className="collection-item avatar">
					<img src={patient.image} alt="" className="circle" />
					<span className="title">{patient.name}</span>
				</Link>
			))
		return <div className="collection">{mappedPatients}</div>
	}

	render() {
		if (!this.state.loaded) return <Loader />
		return this.renderPatients()
	}
}

export default Ward
