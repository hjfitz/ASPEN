import {h, Component} from 'preact'
import M from 'materialize-css'

import {Input, Loader, Select} from '../Partial'
import {fhirBase} from '../../util'

import '../styles/create-patient.scss'

class CreatePatient extends Component {
	/**
	 * Create Patient component
	 * @param {object} props component props
	 */
	constructor(props) {
		super(props)
		this.state = {
			wards: [],
			loaded: false,
		}
	}

	/**
	 * Gets all locations from the API and populates state
	 */
	async componentDidMount() {
		const resp = await fhirBase.get('/Location?type=Ward')
		if (resp.data) {
			this.setState({
				loaded: true,
				wards: resp.data.map(ward => ({val: ward.location_id, text: ward.name})),
			}, () => {
				// the form is showing, so populate with webcam
				navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
					this.video.srcObject = stream
					this.video.onloadedmetadata = () => this.video.play()
				})
			})
		}
	}

	/**
	 * force reinitialisation of select elements
	 */
	componentDidUpdate() {
		const select = document.querySelectorAll('#location_id, #patient-gender')
		M.FormSelect.init(select)
	}

	/**
	 * Takes webcam piped to video and sticks on canvas
	 * Saves this to B64, sets state and pauses the stream
	 */
	getPicture() {
		// TODO: fix width
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, 300, 300, 0, 0, 300, 300)
		const img = this.canvas.toDataURL('image/png')
		this.setState({img}, () => this.video.pause())
	}

	/**
	 * yanks all data from form and posts to API
	 * creates a patient and then an encounter
	 */
	async admit() {
		const form = new FormData()
		if (this.state.img) {
			const img = await fetch(this.state.img).then(r => r.blob())
			console.log('appended image')
			form.append('patient-photo', img)
		}
		const labels = [
			'patient-prefix',
			'patient-given',
			'patient-family',
			'patient-fullname',
			'patient-gender',
			'location_id',
			'contact-prefix',
			'contact-given',
			'contact-family',
			'contact-fullname',
			'contact-phone',
		]
		let invalid = false
		const obj = labels.reduce((acc, label) => {
			const elem = document.getElementById(label)
			const {value} = elem
			if (value) {
				acc[label] = value
				elem.classList.add('valid')
				elem.classList.remove('invalid')
			} else {
				invalid = true
				elem.classList.add('invalid')
				elem.classList.remove('valid')
			}
			return acc
		}, {})
		if (invalid) return
		Object.keys(obj).forEach(label => form.append(label, obj[label]))
		const resp = await fhirBase.post('/Patient', form)
		const {issue: [outcome]} = resp.data
		if (outcome.code === 200) {
			const encForm = new FormData()
			encForm.append('class', 'admission')
			encForm.append('status', 'finished')
			encForm.append('patient_id', outcome.diagnostics.patient_id)
			encForm.append('location_id', obj.location_id)
			const encResp = await fhirBase.post('/Encounter', encForm)
			if (encResp.data.issue[0].code !== 200) {
				// show an error
			}
		} else {
			// do something with an error
		}
	}

	/**
	 * renders component
	 * if no wards, render a loading icon
	 */
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
						<Select
							id="patient-gender"
							default="---Select a Gender---"
							label="Gender"
							options={[{val: 'male', text: 'Male'}, {val: 'female', text: 'Female'}, {val: 'other', text: 'Other'}]}
						/>
						<Select
							id="location_id"
							default="---Select a Ward---"
							options={this.state.wards}
							label="Patient Ward"
						/>
						<div className="col m6 s12">
							<div className="card">
								<div className="card-image">
									<video ref={v => this.video = v} id="video" onClick={() => this.video.play()} />
									<canvas ref={c => this.canvas = c} style={{display: 'none'}} width="300" height="300" />
								</div>
								<div className="card-action">
									<a href="#" onClick={this.getPicture.bind(this)} className="teal-text text-lighten-1">
										<i className="material-icons left">camera_alt</i>Take Picture
									</a>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<h3>Contact Details</h3>
						<Input id="contact-prefix" label="Title" />
						<Input id="contact-given" label="First Name" />
						<Input id="contact-family" label="Surname" />
						<Input id="contact-fullname" label="Full Name" />
						<Input id="contact-phone" label="Phone" type="tel" />
					</div>
					<div className="row">
						<a className="waves-effect waves-light btn" onClick={this.admit.bind(this)}>
							<i className="material-icons left">perm_identity</i>Admit
						</a>
					</div>
				</form>
			</div>
		)
	}
}


export default CreatePatient
