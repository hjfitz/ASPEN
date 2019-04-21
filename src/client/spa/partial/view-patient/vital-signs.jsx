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
		if (!this.tabInstance) this.tabInstance = M.Tabs.init(tabs)
	}

	componentDidUpdate() {
		console.log('[VITAL SIGNS] updating')
		const select = document.querySelectorAll('select')
		if (!this.formInstance) this.formInstance = M.FormSelect.init(select)
		else M.FormSelect.init(select)
	}

	componentWillUnmount() {
		console.log('[VITAL SIGNS] unmounting')
		try {
			if (this.formInstance) this.formInstance.map(el => el.destroy())
			if (this.tabInstance) this.tabInstance.map(el => el.destroy())
		} catch (err) {
			console.log('[VITAL SIGNS] Error with unmount cleanup: ', err)
		}
	}

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
		const form = new FormData()
		const inputs = requiredInputs.map(el => document.getElementById(el))

		inputs.forEach(field => form.append(field.id, field.value))

		const oxygen = document.getElementById('supplemental_oxygen')
		const usesOxygen = oxygen.checked ? 'yes' : 'no'
		form.append('supplemental_oxygen', usesOxygen)

		await this.props.submit(form)
		inputs.splice(inputs.length - 1) // remove level of consciousness from cleanup
		inputs.forEach(input => input.value = '')
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
