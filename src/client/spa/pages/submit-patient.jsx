import {h, Component} from 'preact'
import './submit-patient.scss'

function createPatient(ev) {
	ev.preventDefault()
	const form = new FormData()
	const [profile] = document.getElementById('patient-photo').files
	Array.from(ev.target).forEach(elem => form.append(elem.id, elem.value))
	form.append('profile', profile)
	fetch('/fhir/Patient/', {
		method: 'POST',
		body: form,
		headers: {accept: 'application/fhir+json'},
	}).then(r => r.text()).then(console.log)
}

class SubmitPatient extends Component {
	constructor(props) {
		super(props)
		this.baseUrl = '/fhir/Patient'
	}

	render() {
		return (
			<form className="submit" onSubmit={createPatient.bind(this)} ref={f => this.form = f}>
				<div className="submit-contact">
					<label htmlFor="contact-prefix">Prefix
						<input type="text" id="contact-prefix" required name="contact-prefix" />
					</label>
					<label htmlFor="contact-given">First Name
						<input type="text" id="contact-given" required name="contact-given" />
					</label>
					<label htmlFor="contact-family">Family Name
						<input type="text" id="contact-family" name="contact-family" />
					</label>
					<label htmlFor="contact-fullname">Full Name
						<input type="text" id="contact-fullname" required name="contact-fullname" />
					</label>
					<label htmlFor="contact-phone">Phone Number
						<input type="text" id="contact-phone" required name="contact-phone" />
					</label>
				</div>
				<div className="submit-patient">
					<label htmlFor="patient-prefix">Prefix
						<input type="text" id="patient-prefix" required name="patient-prefix" />
					</label>
					<label htmlFor="patient-given">First Name
						<input type="text" id="patient-given" required name="patient-given" />
					</label>
					<label htmlFor="patient-family">Family Name
						<input type="text" id="patient-family" name="patient-family" />
					</label>
					<label htmlFor="patient-gender">Gender
						<input type="text" id="patient-gender" name="patient-gender" />
					</label>
					<label htmlFor="patient-fullname">Full Name
						<input type="text" id="patient-fullname" required name="patient-fullname" />
					</label>
					<label htmlFor="patient-phone">Phone Number
						<input type="text" id="patient-phone" required name="patient-phone" />
					</label>
					<label htmlFor="patient-photo">Photo
						<input type="file" id="patient-photo" name="patient-photo" />
					</label>
				</div>
				<button type="submit">Submit</button>
			</form>
		)
	}
}

export default SubmitPatient
