import {h, Component} from 'preact'
import {Link} from 'preact-router'

import {Input} from '../Partial'
import {fhirBase} from '../util'

class SearchPatient extends Component {
	/**
	 * render a search field
	 * @param {preact.ComponentProps} props component props
	 */
	constructor(props) {
		super(props)
		this.state = {
			patients: [],
		}
		this.search = this.search.bind(this)
	}

	/**
	 * clear searchbox when page closed/changed
	 */
	componentWillUnmount() {
		if (this.searchBox) this.searchBox.value = ''
	}

	/**
	 * invoked on every keydown in the search field
	 * fetch data and update state
	 */
	async search() {
		const content = document.getElementById('search').value
		const {data} = await fhirBase.get(`/Patient?_query=${content}`)
		this.setState({patients: data})
	}

	/**
	 * normalise patient information and put in to collection, like view-patient and view-ward
	 * @returns {preact.VNode}
	 */
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

	/**
	 * render the search page: one input fields and patient listing (if applicable)
	 * @returns {preact.VNode}
	 */
	render() {
		return (
			<div className="row">
				<header className="col s12">
					<h1>Search</h1>
				</header>
				<Input cbRef={searchBox => this.searchBox = searchBox} className="s12" id="search" label="Search" onKeyUp={this.search} />
				<div className="col s12">
					{this.renderPatients()}
				</div>
			</div>
		)
	}
}

export default SearchPatient
