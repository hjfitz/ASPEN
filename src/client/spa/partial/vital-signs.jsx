import {h, Component} from 'preact'
import M from 'materialize-css'

import {doModal} from '../../util'

import '../styles/vital-signs.scss'

class Vitals extends Component {
	/**
	 * Initialise materialize components on page load
	 */
	componentDidMount() {
		const tabs = document.querySelectorAll('.tabs')
		const select = document.querySelectorAll('select')
		M.FormSelect.init(select)
		M.Tabs.init(tabs, {swipeable: true})
	}

	submitForm() {
		const requiredInputs = [
			'respiratory_rate',
			'oxygen_saturation',
			'heart_rate',
			'body_temperature',
			'systolic_bp',
			'level_of_consciousness',
		]

		const invalid = requiredInputs
			.map(el => document.getElementById(el))
			.filter((inp) => {
				if (!inp.value) return true
				if (Number.isNaN(inp.value) && inp.id !== 'level_of_consciousness') return true
				return false
			})
			.map(inp => inp.dataset.invalidName)
		if (invalid.length) {
			doModal(
				'Error with form!',
				`You've missed out, or entered some of the fields incorrectly:</p>
				<ul class="browser-default"><li>${invalid.join('</li><li>')}</ul>`,
			)
			return
		}

		// everything must be correct, send it back to the main component
		const form = new FormData()
		const diagnosticReport = [...requiredInputs, 'supplemental_oxygen']
			.map(el => document.getElementById(el))
			.forEach(field => form.append(field.id, field.value))
			// .reduce((acc, cur) => {
			// 	acc[cur.id] = cur.value
			// 	return acc
			// }, {})
		this.props.cb(diagnosticReport)
	}

	/**
	 * Render input form for vitals and output of prior vitals
	 * @returns {VNode} patient info
	 */
	render() {
		return (
			<div className="card">
				<div className="card-tabs">
					<ul className="tabs tabs-fixed-width">
						<li className="tab"><a className="active" href="#record">Record Vital Signs</a></li>
						<li className="tab"><a href="#history">Previous Vital Signs</a></li>
					</ul>
				</div>
				<div className="card-content">
					<div id="record">
						<div className="row">
							<form action="" className="col s12">
								<div className="row">
									<div className="input-field col s6">
										<input id="respiratory_rate" type="number" className="validate" data-invalid-name="Respiratory Rate" />
										<label htmlFor="respiratory_rate">Respiratory Rate</label>
									</div>
									<div className="input-field col s6">
										<input id="oxygen_saturation" type="number" className="validate" data-invalid-name="Oxygen Saturation" />
										<label htmlFor="oxygen_saturation">Oxygen Saturation</label>
									</div>
								</div>

								<div className="row">
									<div className="input-field col s6">
										<input id="heart_rate" type="number" className="validate" data-invalid-name="Heart Rate" />
										<label htmlFor="heart_rate">Heart Rate</label>
									</div>
									<div className="input-field col s6">
										<input id="body_temperature" type="number" className="validate" data-invalid-name="Body Temperature" />
										<label htmlFor="body_temperature">Body Temperature</label>
									</div>
								</div>

								<div className="row">
									<div className="input-field col s6">
										<input id="systolic_bp" type="number" className="validate" data-invalid-name="Blood Pressure" />
										<label htmlFor="systolic_bp">Systolic Blood Pressure</label>
									</div>
									<div className="input-field col s6">
										<select id="level_of_consciousness" data-invalid-name="Level of Consciousness">
											<option value="" disabled selected>Select level</option>
											<option value="A">Aware</option>
											<option value="D">Drowzy</option>
											<option value="U">Unconscious</option>
										</select>
										<label>Level of Consciousness</label>
									</div>

								</div>

								<div className="row">
									<div className="col s6">
										<p>
											<label>
												<input name="supplemental_oxygen" id="supplemental_oxygen" type="checkbox" />
												<span>Supplemental Oxygen</span>
											</label>
										</p>
									</div>
									<div className="col s6">
										<a className="waves-effect waves-light btn" onClick={this.submitForm.bind(this)}>Submit</a>
									</div>

								</div>

							</form>
						</div>

					</div>
					<div id="history">Chart to go here</div>
				</div>
			</div>
		)
	}
}

export default Vitals
