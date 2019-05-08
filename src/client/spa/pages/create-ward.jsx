import {h, Component} from 'preact'
import M from 'materialize-css'

import {fhirBase, doModal} from '../util'

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
	}

	/**
	 * Initialise all materialize elements on page load
	 */
	componentDidMount() {
		this.instances.push(
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
		const inputs = [this.name, this.desc] // inputs to check
		const valid = CreateWard.validateForms(inputs)
		if (!valid) return // not valid. let the classNames do the talking
		// attempt to post
		try {
			const resp = await fhirBase.post('/Location', {
				resourceType: 'Location',
				id: 196,
				meta: {
					versionID: 1,
					lastUpdated: '2019-04-23T17:33:43.626Z',
				},
				status: 'active',
				name: this.name.value,
				description: this.desc.value,
				coding: [{
					system: 'https://www.hl7.org/fhir/codesystem-location-physical-type.html',
					code: 'wa',
					display: 'Ward',
				}],
			})
			const {id} = resp.data.issue[0].diagnostics
			console.log(resp.data)
			inputs.forEach(input => input.value = '')
		} catch (err) {
			doModal('Error!', `There was an error whilst creating the ward: ${err}`)
		}
	}

	/**
	 * render the form!
	 */
	render() {
		return (
			<div className="row">
				<div className="create-location-input col s12">
					<header><h1>Create a Location</h1></header>
					<form ref={f => this.form = f} className="row">
						<div className="input-field col m6 s12">
							<input id="name" type="text" ref={i => this.name = i} data-length="24" />
							<label htmlFor="name" className="validate">Name</label>
						</div>

						<div className="input-field col s12">
							<textarea id="description" className="materialize-textarea" ref={t => this.desc = t} data-length="120" />
							<label htmlFor="description" className="validate">Description</label>
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
