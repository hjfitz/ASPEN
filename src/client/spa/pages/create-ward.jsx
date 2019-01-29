import {h, Component} from 'preact'
import M from 'materialize-css'

import {fhirBase} from '../../util'

import '../styles/create-location.scss'

class CreateWard extends Component {
	/**
	 * Ensure elements have some content and change their class accordingly
	 * @param {Array<VNode>} inputs Inputs to validate .value
	 * @return {boolean} Whether the given inputs are valid
	 */
	static validateForms(inputs) {
		// give empty fields a red box, remove valid classname too
		const invalid = inputs.filter((control) => {
			if (!control.value) {
				control.classList.add('invalid')
				control.classList.remove('valid')
			}
			return !control.value
		})

		// give all valid ones the green box, removing the red
		inputs.forEach((control) => {
			if (!invalid.includes(control)) {
				control.classList.remove('invalid')
				control.classList.add('valid')
			}
		})

		// length === 0 if all inputs have some data. cast this to boolean
		return !invalid.length
	}

	/**
	 * Page component used to create locations by interacting with /fhir/Location API
	 * @param {object} props Props given to the preact component
	 */
	constructor(props) {
		super(props)
		this.instances = []
		// used display a popup if there's a server-side error
		this.state = {
			showPopup: false,
			message: '',
		}
	}

	/**
	 * Initialise all materialize elements on page load
	 */
	componentDidMount() {
		this.instances.push(
			M.FormSelect.init(this.type),
			M.CharacterCounter.init(this.name),
			M.CharacterCounter.init(this.desc),
		)
	}


	/**
	 * Validate the elements on the page and then POST their data to /fhir/Location
	 * @param {Event} ev Click event
	 * @returns {Promise<void>}
	 */
	async makeWard(ev) {
		ev.preventDefault() // don't refresh the page - this is a SPA!
		const inputs = [this.name, this.desc, this.type] // inputs to check
		const valid = CreateWard.validateForms(inputs)
		if (!valid) return // not valid. let the classNames do the talking

		// populate a form and send it to the server
		const locForm = new FormData()
		inputs.forEach(control => locForm.set(control.id, control.value))

		// attempt to post
		try {
			const resp = await fhirBase.post('/Location', locForm)
			const {id} = resp.data.issue[0].diagnostics
			const message = [
				<h3>Success</h3>,
				<p>Successfully created {this.name.value} as a {this.type.value} with ID {id}</p>,
			]
			this.setState({
				message,
				showPopup: true,
			})
		} catch (err) {
			this.setState({
				showPopup: true,
				message: [
					<h3>Error!</h3>,
					<p>There was an error creating the location:</p>,
					<p>{err}</p>,
				],
			})
		}
	}

	/**
	 * render the form!
	 */
	render() {
		let popup = ''
		if (this.state.showPopup) {
			popup = (
				<div className="">
					{this.state.message}
				</div>
			)
		}
		return (
			<div className="row">
				{popup}
				<div className="create-location-input col s12">
					<header><h1>Create a Ward</h1></header>
					<form ref={f => this.form = f} className="row">
						<div className="input-field col m6 s12">
							<input id="name" type="text" ref={i => this.name = i} data-length="24" />
							<label htmlFor="name" className="validate">Name</label>
						</div>

						<div className="input-field col s12">
							<textarea id="description" className="materialize-textarea" ref={t => this.desc = t} data-length="120" />
							<label htmlFor="description" className="validate">Description</label>
						</div>

						<div className="col s12 m6">
							<label htmlFor="type">Type of location:</label>
							<select id="type" ref={s => this.type = s} className="validate">
								<option value="" disabled selected>--Please select an option---</option>
								<option value="ward">Ward</option>
								<option value="wing">Wing</option>
							</select>
						</div>

						<div className="col s12">
							<a className="waves-effect waves-light btn" onClick={this.makeWard.bind(this)}>Submit</a>

						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default CreateWard
