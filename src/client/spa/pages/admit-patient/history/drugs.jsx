import {h} from 'preact'

import Questionnaire from './Questionnaire'
import {IncButton, DecButton} from './util'

class Drugs extends Questionnaire {
	constructor() {
		super()
		this.state = {numDrugs: 1}
		this.inc = this.inc.bind(this)
		this.dec = this.dec.bind(this)
	}

	/**
	 * create a function to increase an item in state
	 * @param {string} type key in state to update
	 * @returns {Function}
	 */
	inc(type) {
		return () => this.setState({[type]: this.state[type] + 1})
	}

	/**
	 * create a function to decrease an item in state
	 * @param {string} type key in state to update
	 * @returns {Function}
	 */
	dec(type) {
		return () => this.setState({[type]: this.state[type] - 1})
	}

	/**
	 * @returns {preact.VNode}
	 */
	render() {
		return (
			<div className="row">
				<h4>Drug Use</h4>
				<form className="col s12 patient-history-input" data-form-key="drug-currently-use" data-materialize-type="radio-group" action="">
					<h6>Do you currently use recreational drugs/substances?</h6>
					<p>
						<label>
							<input className="with-gap" name="group1" type="radio" value="yes" />
							<span onClick={this.toggleQuestionnaire(true).bind(this)}>Yes</span>
						</label>
					</p>
					<p>
						<label>
							<input className="with-gap" name="group1" type="radio" value="no" checked />
							<span onClick={this.toggleQuestionnaire().bind(this)}>No</span>
						</label>
					</p>
				</form>
				{this.state.showQuestionnaire ? <DrugsQuestionnaire inc={this.inc} dec={this.dec} numDrugs={this.state.numDrugs} /> : ''}
			</div>
		)
	}
}

const DrugsQuestionnaire = props => (
	<div>
		<div className="input-field col s12">
			<div>
				<h6>Which kind and how frequently?</h6>
				<div className="patient-history-input" data-form-key="drug-use-frequency" data-materialize-type="multiple-input-group">
					{Array.from({length: props.numDrugs}).map((_, idx) => (
						<div className="scrip-input row input-group">
							<div className="col m6 s12 input-field">
								<input id={`drug-name-${idx}`} type="text" className="validate name" />
								<label htmlFor={`drug-name-${idx}`}>Drug Name</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id={`drug-dose-${idx}`} type="text" className="validate dose" />
								<label htmlFor={`drug-dose-${idx}`}>Dose</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id={`drug-freq-${idx}`} type="text" className="validate frequency" />
								<label htmlFor={`drug-freq-${idx}`}>Frequency</label>
							</div>
						</div>
					))}
				</div>
				<div className="row">
					<IncButton onClick={props.inc} />
					<DecButton onClick={props.dec} />
				</div>
			</div>
		</div>
		<form className="col s12 patient-history-input" data-form-key="drug-injected" data-materialize-type="radio-group" action="">
			<h6>Have you ever injected recreational drugs with a needle?</h6>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="no" checked />
					<span>No</span>
				</label>
			</p>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="yes" />
					<span>yes</span>
				</label>
			</p>
		</form>
	</div>
)

export default Drugs
