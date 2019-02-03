import {h, Component} from 'preact'
import {Link} from 'preact-router'

import {Input} from '../Partial'
import {fhirBase} from '../../util'

class SearchPatient extends Component {
	constructor(props) {
		super(props)
		this.state = {
			patients: [],
		}
		this.search = this.search.bind(this)
	}

	/**
	 * clear searchbox
	 */
	componentWillUnmount() {
		document.getElementById('search').value = ''
	}


	async search() {
		const content = document.getElementById('search').value
		const {data} = await fhirBase.get(`/Patient?_query=${content}`)
		console.log(data)
		this.setState({patients: data})
	}

	renderPatients() {
		const mappedPatients = this.state.patients
			.map((patient) => {
				const {name: [name], photo, id} = patient
				const displayName = `${name.prefix[0]}. ${name.text}`
				const displayImage = photo.length ? photo[0].url : '/patient/anon.png'
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
		return (
			<div className="row">
				<header className="col s12">
					<h1>Search</h1>
				</header>
				<Input className="s12" id="search" label="Search" onKeyUp={this.search} />
				<div className="col s12">
					{this.renderPatients()}
				</div>
			</div>
		)
	}
}

export default SearchPatient
