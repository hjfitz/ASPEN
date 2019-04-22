import {h, Component} from 'preact'
import {Link} from 'preact-router'

import {Input} from '../Partial'
import {fhirBase} from '../util'

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
		if (this.searchBox) this.searchBox.value = ''
	}


	async search() {
		const content = document.getElementById('search').value
		const {data} = await fhirBase.get(`/Patient?_query=${content}`)
		const patients = data.length ? data : []
		this.setState({patients})
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
		return mappedPatients.length ? <div className="collection">{mappedPatients}</div> : ''
	}


	render() {
		return (
			<div className="row">
				<header className="col s12">
					<h1>Search</h1>
				</header>
				<Input
					cbRef={searchBox => this.searchBox = searchBox}
					className="s12"
					id="search"
					label="Search"
					onKeyUp={this.search}
				/>
				<div className="col s12">
					{this.renderPatients()}
				</div>
			</div>
		)
	}
}

export default SearchPatient
