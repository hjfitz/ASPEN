import {h, Component} from 'preact'
import {route} from 'preact-router'
import M from 'materialize-css'
import isMobile from 'ismobilejs'

import {Input, Loader, Select, PatientHistory} from '../Partial'
import {fhirBase, doModal, getJwtPayload} from '../util'

import '../styles/create-patient.scss'

// so hacky but that's what you get for using non-standard elems materialize ¯\_(ツ)_/¯
function createHistoryForm() {
	const elems = document.querySelectorAll('.patient-history-input')
	const values = [...elems].reduce((acc, elem) => {
		const {formKey, materializeType} = elem.dataset
		const key = formKey.replace(/-/g, '_')
		if (materializeType && materializeType === 'select') {
			const vals = M.FormSelect.getInstance(elem).getSelectedValues()
			acc[key] = vals
		} else if (materializeType && materializeType === 'radio-group') {
			acc[key] = elem.querySelector(':checked').value
		} else {
			acc[key] = elem.value
		}
		return acc
	}, {})
	// get user id from database
	values.sign_off_userid = getJwtPayload(localStorage.token).userid
	// signature
	const sigCanv = document.getElementById('sign-off-canvas')
	const rawImg = sigCanv.toDataURL('image/png')
	values.sign_off_blob = rawImg
	return values
}

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
				wards: resp.data.map(ward => ({val: ward.id, text: ward.name})),
			}, async () => {
				// the form is showing and webcam is, so populate with webcam
				const select = document.querySelectorAll('#location_id, #patient-gender, .patient-details-select')
				M.FormSelect.init(select)

				try {
					const stream = await navigator.mediaDevices.getUserMedia({video: true})
					this.video.srcObject = stream
					this.video.onloadedmetadata = this.video.play
					// when the video plays, the height and width of the container changes
					// set the canvas here
					this.video.addEventListener('playing', () => {
						const dimensions = this.video.getBoundingClientRect()
						this.canvas.height = dimensions.height
						this.canvas.width = dimensions.width
					})
				} catch (err) {
					M.toast({html: 'There was an error initialising the Webcam'})
					console.error(`Webcam error: ${err}`)
				}
				const date = document.querySelectorAll('.datepicker')
				M.Datepicker.init(date, {autoClose: true})
			})
		}
	}

	/**
	 * Takes webcam piped to video and sticks on canvas
	 * Saves this to B64, sets state and pauses the stream
	 */
	getPicture() {
		console.log('[CREATE] Saving image')
		const dimensions = this.video.getBoundingClientRect()
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, dimensions.width, dimensions.height)
		const img = this.canvas.toDataURL('image/png')
		this.img = img
		doModal('Success', 'Image saved')
		this.video.pause()
	}

	/**
	 * serialise the uploaded image and save it
	 * @param {EventTarget} ev Event from input onChange event
	 */
	setImg(ev) {
		try {
			const {files: [file]} = ev.target
			const reader = new FileReader()
			reader.addEventListener('load', () => this.img = reader.result, false)
			reader.readAsDataURL(file)
		} catch (err) {
			doModal('Error', `There was an error setting the image: ${err}`)
		}
	}

	/**
	 * yanks all data from form and posts to API
	 * creates a patient and then an encounter
	 */
	async admit() {
		const form = new FormData()
		if (this.img) {
			console.log('[CREATE] Appending image')
			const img = await fetch(this.img).then(r => r.blob())
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
		const invalid = []
		const obj = labels.reduce((acc, label) => {
			const elem = document.getElementById(label)
			const {value} = elem
			if (value) {
				acc[label] = value
				elem.classList.add('valid')
				elem.classList.remove('invalid')
			} else {
				invalid.push(label)
				elem.classList.add('invalid')
				elem.classList.remove('valid')
			}
			return acc
		}, {})
		if (invalid.length) {
			const err = invalid
				.map(la => la.replace(/-/g, ' '))
				.map(la => la.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
				.map(la => `<li>${la}</li>`)
				.join('\n')
			doModal('Error with form!', `Please complete the following fields: <ul>${err}</ul>`)
			return
		}
		Object.keys(obj).forEach(label => form.append(label, obj[label]))
		try {
			const resp = await fhirBase.post('/Patient', form)
			const {issue: [outcome]} = resp.data
			if (outcome.code === 200) {
				const encForm = new FormData()
				encForm.append('class', 'admission')
				encForm.append('status', 'finished')
				encForm.append('patient_id', outcome.diagnostics.patient_id)
				encForm.append('location_id', obj.location_id)
				const encResp = await fhirBase.post('/Encounter', encForm)
				const historyRaw = createHistoryForm()
				const histForm = new FormData()
				Object.keys(historyRaw).forEach((key) => {
					histForm.set(key, historyRaw[key])
				})
				const histResp = await fhirBase.post('/History', histForm)
				console.log(histResp)
				doModal('Success', encResp.data.issue[0].details.text)
			} else {
				doModal('Error', outcome.data.issue[0].details.text)
			}
		} catch (err) {
			console.warn('[create patient]', err)
			doModal('Error', `There is an error with patient creation: ${err}`)
		}
	}


	/**
	 * renders component
	 * if no wards, render a loading icon
	 * @returns {VNode}
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		return (
			<div className="row" id="patient-form">
				<h2>Admit a New Patient</h2>
				<form className="col s12">
					<div className="row">
						<div className="col s12">
							<h3>Patient Details</h3>
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
								{!isMobile.any
									? (
										<div className="card">
											<div className="card-image">
												<video ref={v => this.video = v} id="video" onClick={() => this.video.play()} />
												<canvas ref={c => this.canvas = c} style={{display: 'none'}} width="300" height="300" />
											</div>
											<div className="card-action">
												<a onClick={this.getPicture.bind(this)} className="teal-text text-lighten-1">
													<i className="material-icons left">camera_alt</i>Take Picture
												</a>
											</div>
										</div>
									)
									: (
										<div className="file-field input-field">
											<div className="btn">
												<span>Take Photo</span>
												<input
													onChange={this.setImg.bind(this)}
													type="file"
													accept="image/*"
													capture="camera"
													value="Take Photo"
												/>
											</div>
											<div className="file-path-wrapper">
												<input className="file-path validate" type="text" />
											</div>
										</div>
									)
								}
							</div>
						</div>
					</div>
					<PatientHistory />
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
