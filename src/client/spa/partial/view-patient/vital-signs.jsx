import {h, Component} from 'preact'
import M from 'materialize-css'
import format from 'date-fns/format'

import WarningScore from '../../WarningScore'
import {doModal} from '../../util'

import '../../styles/vital-signs.scss'

// swap an EWS for a class to colour table cells (in createTable())
const ewsToClass = [
	'',
	' yellow',
	' orange',
	' red',
]

function createTable(history) {
	const historyWithEWS = history.map((observation) => {
		const ews = new WarningScore(observation)
		// format observation history (from FHIR API) in to something that can be used within the DOM
		// score for a hover <abbr>
		// className to visualise the EWS
		// value to display
		return {
			date: format(observation.date, 'hh:mma, Do MMM YYYY'),
			respiratoryRate: {
				score: ews.scoreResp(),
				classname: ewsToClass[ews.scoreResp()],
				value: observation.respiratory_rate,
			},
			oxySat: {
				score: ews.scoreOxy(),
				classname: ewsToClass[ews.scoreOxy()],
				value: observation.oxygen_saturation,
			},
			heartRate: {
				score: ews.scoreHeart(),
				classname: ewsToClass[ews.scoreHeart()],
				value: observation.heart_rate,
			},
			bodyTemp: {
				score: ews.scoreTemp(),
				classname: ewsToClass[ews.scoreTemp()],
				value: observation.body_temperature,
			},
			bloodPressure: {
				score: ews.scoreBP(),
				classname: ewsToClass[ews.scoreBP()],
				value: observation.systolic_bp,
			},
			levelOfConsciousness: {
				score: ews.scoreCons(),
				classname: ewsToClass[ews.scoreCons()],
				value: observation.level_of_consciousness,
			},
			supplOxygen: {
				score: ews.scoreSuppOxy(),
				classname: ewsToClass[ews.scoreSuppOxy()],
				value: observation.supplemental_oxygen,
			},
		}
	})
	const tableDOM = historyWithEWS.map(row => (
		<tr>
			<td>{row.date}</td>
			<td className={row.respiratoryRate.classname}>
				<abbr title={row.respiratoryRate.score}>{row.respiratoryRate.value}</abbr>
			</td>
			<td className={row.oxySat.classname}>
				<abbr title={row.oxySat.score}>{row.oxySat.value}</abbr>
			</td>
			<td className={row.heartRate.classname}>
				<abbr title={row.heartRate.score}>{row.heartRate.value}</abbr>
			</td>
			<td className={row.bodyTemp.classname}>
				<abbr title={row.bodyTemp.score}>{row.bodyTemp.value}</abbr>
			</td>
			<td className={row.bloodPressure.classname}>
				<abbr title={row.bloodPressure.score}>{row.bloodPressure.value}</abbr>
			</td>
			<td className={row.levelOfConsciousness.classname}>
				<abbr title={row.levelOfConsciousness.score}>{row.levelOfConsciousness.value}</abbr>
			</td>
			<td className={row.supplOxygen.classname}>
				<abbr title={row.supplOxygen.score}>{row.supplOxygen.value}</abbr>
			</td>
		</tr>
	))
	return tableDOM
}

class Vitals extends Component {
	/**
	 * Initialise materialize components on page load
	 */
	componentDidMount() {
		console.log('[VITAL SIGNS] mounting')
		const tabs = document.querySelectorAll('.tabs.tabs-fixed-width.vital-record-view-tabs')
		const select = document.querySelectorAll('select')
		if (!this.formInstance) this.formInstance = M.FormSelect.init(select)
		if (!this.tabInstance) this.tabInstance = M.Tabs.getInstance(tabs) || M.Tabs.init(tabs)
	}

	/**
	 * the main router sets state, which propogates an update here
	 * this causes a re-render which kills select instances
	 * re-build the select
	 */
	componentDidUpdate() {
		console.log('[VITAL SIGNS] updating')
		const select = document.querySelectorAll('select')
		if (!this.formInstance) this.formInstance = M.FormSelect.init(select)
		else M.FormSelect.init(select)
	}

	/**
	 * on unmount, kill all materialize instances so as to not break the app
	 */
	componentWillUnmount() {
		console.log('[VITAL SIGNS] unmounting')
		try {
			console.log(this.tabInstance)
			if (this.formInstance) this.formInstance.map(el => el.destroy())
			if (this.tabInstance) this.tabInstance.map(el => el.destroy())
		} catch (err) {
			console.log('[VITAL SIGNS] Error with unmount cleanup: ', err)
		}
	}

	/**
	 * given the user has pressed 'admit'
	 * 1. validate all items on the page
	 * 2a. if not valid, inform the user with coloured boxes and a modal
	 * 2b. if valid: call props.submitform with the associated vital signs, formatted correctly
	 */
	async submitForm() {
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
		const inputs = requiredInputs.map(el => document.getElementById(el))
		const observations = {}
		inputs.forEach(field => observations[field.id] = field.value)
		console.log(observations)
		const oxygen = document.getElementById('supplemental_oxygen')
		const usesOxygen = oxygen.checked ? 'yes' : 'no'
		// form.append('supplemental_oxygen', usesOxygen)
		const last_updated = new Date()

		await this.props.submit({
			resourceType: 'DiagnosticReport',
			id: 1,
			meta: {last_updated},
			status: 'final',
			result: [
				{
					resourceType: 'Observation',
					code: {text: 'respiratory_rate'},
					meta: {last_updated},
					status: 'final',
					valueQuantity: {value: observations.respiratory_rate, system: 'http://unitsofmeasure.org', unit: 'breaths/minute', code: '/min'},
				},
				{
					resourceType: 'Observation',
					code: {text: 'oxygen_saturation'},
					meta: {last_updated},
					status: 'final',
					valueQuantity: {value: observations.oxygen_saturation, system: 'http://unitsofmeasure.org', unit: '%', code: '%'},
				},
				{
					resourceType: 'Observation',
					code: {text: 'supplemental_oxygen'},
					meta: {last_updated},
					status: 'final',
					valueQuantity: {value: usesOxygen, system: 'http://unitsofmeasure.org', unit: '{yes/no}', code: ''},
				},
				{
					resourceType: 'Observation',
					code: {text: 'body_temperature'},
					meta: {last_updated},
					valueQuantity: {value: observations.body_temperature, system: 'http://unitsofmeasure.org', unit: 'C', code: 'cel'}},
				{
					resourceType: 'Observation',
					code: {text: 'systolic_bp'},
					meta: {last_updated},
					valueQuantity: {value: observations.systolic_bp, system: 'http://unitsofmeasure.org', unit: 'mmHg', code: 'mm[Hg]'},
				},
				{
					resourceType: 'Observation',
					code: {text: 'heart_rate'},
					meta: {last_updated},
					valueQuantity: {value: observations.heart_rate, system: 'http://unitsofmeasure.org', unit: 'beats/min', code: '/min'},
				},
				{
					resourceType: 'Observation',
					code: {text: 'level_of_consciousness'},
					meta: {last_updated},
					valueQuantity: {value: observations.level_of_consciousness, system: 'http://unitsofmeasure.org', unit: '{score}', code: ''},
				},
			],
		})
		// inputs.splice(inputs.length - 1) // remove level of consciousness from cleanup
		// inputs.forEach(input => input.value = '')
		M.updateTextFields()
	}

	/**
	 * Render input form for vitals and output of prior vitals
	 * @param {object} props component props
	 * @param {DiagnosticReport[]} props.history patient obs history
	 * @returns {VNode} patient info
	 */
	render(props) {
		return (
			<div className="card">
				<div className="card-tabs">
					<ul className="tabs tabs-fixed-width vital-record-view-tabs">
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
										<input id="body_temperature" type="number" step="0.01" className="validate" data-invalid-name="Body Temperature" />
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
												<input name="supplemental_oxygen" id="supplemental_oxygen" type="checkbox" value="on" />
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
					<div id="history">
						<table className="responsive-table striped highlght">
							<thead>
								<tr>
									<th>Date</th>
									<th>Respiratory rate</th>
									<th>Oxygen Saturation</th>
									<th>Heart Rate</th>
									<th>Body Temperature</th>
									<th>Blood Pressure</th>
									<th>Level of Consciousness</th>
									<th>Supplemental Oxygen</th>
								</tr>
							</thead>
							<tbody>
								{createTable(props.history)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default Vitals
