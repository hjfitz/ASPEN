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
				// the form is showing, so populate with webcam
				navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
					this.video.srcObject = stream
					this.video.onloadedmetadata = () => this.video.play()
				})
			})
		}
	}

	componentDidUpdate() {
		const select = document.querySelectorAll('#location_id, #patient-gender')
		M.FormSelect.init(select)
	}

	getPicture() {
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, 300, 300, 0, 0, 300, 300)
		const img = this.canvas.toDataURL('image/png')
		this.setState({img}, () => this.video.pause())
	}

	admit() {

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
						{/* todo: make this use getusermedia */}
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
						<Input id="contact-phone" label="Phone" />
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
