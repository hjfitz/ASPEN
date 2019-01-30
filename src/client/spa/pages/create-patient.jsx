import {h, Component} from 'preact'
import M from 'materialize-css'

import {Input, Loader, Select} from '../Partial'
import {fhirBase} from '../../util'

import '../styles/create-patient.scss'


class CreatePatient extends Component {
	constructor(props) {
		super(props)
		this.state = {
			wards: [],
			loaded: false,
		}
	}

	async componentDidMount() {
		const resp = await fhirBase.get('/Location?type=Ward')
		if (resp.data) {
			this.setState({
				loaded: true,
				wards: resp.data.map(ward => ({val: ward.location_id, text: ward.name})),
			}, () => {
				const select = document.querySelectorAll('#location_id, #patient-gender')
				M.FormSelect.init(select)
			})
		}
	}

	render() {
		if (!this.state.loaded) return <Loader />
		return (
			<div className="row">
				<h1>Admit a new patient</h1>
				<form className="col s12">
					<div className="row">
						<h3>Patient Information</h3>
						<Input id="patient-prefix" label="Title" />
						<Input id="patient-given" label="First Name" />
						<Input id="patient-family" label="Surname" />
						<Input id="patient-fullname" label="Full Name" />
						<Select id="patient-gender" default="---Select a Gender---" label="Gender" options={[{val: 'male', text: 'Male'}, {val: 'female', text: 'Female'}, {val: 'other', text: 'Other'}]} />
						<Select ref={s => this.locations = s} id="location_id" default="---Select a Ward---" options={this.state.wards} label="Patient Ward" />
						{/* todo: make this use getusermedia */}
						<div className="file-field input-field col s12">
							<div className="btn">
								<span>Patient Photo</span>
								<input type="file" />
							</div>
							<div className="file-path-wrapper">
								<input className="file-path validate" type="text" />
							</div>
						</div>
					</div>
					<div className="row">
						<h3>Contact Details</h3>
						<Input id="contact-name" label="Contact Name" />
					</div>
				</form>
			</div>
		)
	}
}


export default CreatePatient
