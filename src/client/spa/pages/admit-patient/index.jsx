import {h, Component} from 'preact'
import {route} from 'preact-router'
import M from 'materialize-css'

import PatientDemographicInfo from './Patient'
import PatientHistoryInfo from  './History'
import ContactInfo from './Contact'

import {Input, Loader, Select, PatientHistory} from '../../Partial'
import {fhirBase, doModal, getJwtPayload} from '../../util'

import '../../styles/create-patient.scss'

function createHistoryForm() {
	const elems = document.querySelectorAll('.patient-history-input')
	const form = [...elems].reduce((acc, elem) => {
		// dataset should be of form '$KEY-attr, eg health-childhood-illnesses
		const [key, ...rest] = elem.dataset.formKey.split('-')
		const attr = rest.join('-')
		// ensure accumulator has form {health: {}, drugs: {}}
		if (!(key in acc)) acc[key] = {}
		// get handle on current place in data structure
		const cur = acc[key]
		// fetch data from element
		switch(elem.dataset.materializeType) {
			// use materialize method to get selected values
			case 'select': {
				const inst = M.FormSelect.getInstance(elem)
				cur[attr] = inst.getSelectedValues()
				return acc
			}
			// materialize requires a lot of markup for a radio button (form>p>label>input)
			// find the checked radio button and get the val (true/false - set in elem.value prop)
			case 'radio-group': {
				const checked = elem.querySelector(':checked')
				cur[attr] = checked.value
				return acc
			}
			// saved for when there's the option to add/remove 
			case 'input-group': {
				const inputs = elem.querySelectorAll('input')
				// get all non-null values from inputs in the group
				cur[attr] = [...inputs].map(el => el.value.trim()).filter(Boolean)
				return acc
			}
			default: {
				cur[attr] = elem.value.trim()
				return acc
			}
		}
	}, {})
	const sigCanv = document.getElementById('sign-off-canvas')
	const rawImg = sigCanv.toDataURL('image/png')
	form.sign.image = rawImg
	return form
}

class AdmitPatient extends Component {
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
	getImg() {
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
				histForm.set('patient_id', outcome.diagnostics.patient_id)
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

	setVideo(ref) {
		this.video = ref
	}

	setCanvas(ref) {
		this.canvas = ref
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
				<form>
					<PatientDemographicInfo 
						wards={this.state.wards} 
						getImg={this.getImg.bind(this)} 
						setImg={this.setImg.bind(this)} 
						setVideo={this.setVideo.bind(this)}
						setCanvas={this.setCanvas.bind(this)}
						playVideo={() => this.video.play()}
					/>
					<PatientHistoryInfo />
					<ContactInfo />
						<a className="waves-effect waves-light btn col s12" onClick={() => console.log(createHistoryForm())}>
							{/* this.admit.bind(this)}> */}
							<i className="material-icons left">perm_identity</i>Admit
						</a>
				</form>
			</div>
		)
	}
}


export default AdmitPatient
