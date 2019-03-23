import {h} from 'preact'
import Questionnaire from './Questionnaire'

class Drugs extends Questionnaire {
	render() {
		return (
			<div className="row">
				<div className="col s12">
					<form className="col s6 patient-history-input" data-form-key="health-habits-current-drug-use" data-materialize-type="radio-group" action="">
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
				</div>
				{this.state.showQuestionnaire ? <DrugsQuestionnaire /> : ''}
			</div>
		)
	}
}

const DrugsQuestionnaire = () => (
	<div>
		<div className="input-field col s6">
			<h6>Which kind and how frequently?</h6>
			<textarea id="drugs-used" className="materialize-textarea patient-history-input" data-form-key="health-habits-drug-use-frequency" />
		</div>
		<form className="col s6 patient-history-input" data-form-key="health-habits-patient-ever-injected-drugs" data-materialize-type="radio-group" action="">
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
