import {h} from 'preact'
import M from 'materialize-css'

import Questionnaire from './Questionnaire'

class Tobacco extends Questionnaire {
	componentDidUpdate() {
		// todo: change this to ref
		const pickers = document.querySelectorAll('.datepicker')
		M.Datepicker.init(pickers)
		const select = document.querySelectorAll('select')
		M.FormSelect.init(select)
	}

	render() {
		return (
			<div className="row">
				<h4>Tobacco Use</h4>
				<div className="col s12">
					<div className="row">
						<form className="col s12 patient-history-input" data-form-key="tobacco-used-prior" data-materialize-type="radio-group" action="">
							<h6>Have you used Tobacco in the last 5 years?</h6>
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
					</div>
				</div>
				{this.state.showQuestionnaire ? <TobaccoQuestionnaire /> : ''}
			</div>
		)
	}
}

const TobaccoQuestionnaire = () => (
	<div>
		<div className="col s12">
			<h6>If you have given up, when did you last smoke?</h6>
			<input type="text" className="datepicker patient-history-input" data-form-key="tobacco-last-use" />
		</div>
		<form className="col s12 patient-history-input" data-form-key="tobacco-current-use" data-materialize-type="radio-group" action="">
			<h6>Are you currently using Tobacco?</h6>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="yes" />
					<span>Yes</span>
				</label>
			</p>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="no" checked />
					<span>No</span>
				</label>
			</p>
		</form>
		<div className="input-field col s12 tooltipped" data-position="top" data-tooltip="Include Cigarettes, Pipe and Cigars">
			<h6>If you're currently using tobacco, which are you using?</h6>
			<textarea id="tobacco-used" className="materialize-textarea  patient-history-input" data-form-key="tobacco-type-used" />
		</div>
		<form className="col s12 patient-history-input" data-form-key="tobacco-nicotine-replace-therapy" data-materialize-type="radio-group" action="">
			<h6>Are you currently using nicotine replacement therapy?</h6>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="yes" />
					<span>Yes</span>
				</label>
			</p>
			<p>
				<label>
					<input className="with-gap" name="group1" type="radio" value="no" checked />
					<span>No</span>
				</label>
			</p>
		</form>
		<div className="input-field col s12">
			<select className="patient-details-select patient-history-input" data-form-key="tobacco-nicotine-replacement-types" data-materialize-type="select">
				<option value="" disabled selected>Select one</option>
				<option value="">dont know</option>
				<option value="">which types</option>
				<option value="">exist out there</option>
				<option value="">yet</option>
			</select>
			<label>If yes, which type?</label>
		</div>
	</div>
)

export default Tobacco
