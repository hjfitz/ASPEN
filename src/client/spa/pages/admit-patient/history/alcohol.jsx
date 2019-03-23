import {h} from 'preact'
import Questionnaire from './Questionnaire'


class Alcohol extends Questionnaire {
	render() {
		return (
			<div className="row">
				<div className="col s12">
					<h4>Alcohol Use</h4>
					<div className="row">
						<form className="col s12 patient-history-input" data-form-key="alcohol-does-drink" data-materialize-type="radio-group" action="">
							<h5>Do you drink alcohol?</h5>
							<p>
								<label>
									<input className="with-gap" name="group1" value="yes" type="radio" />
									<span onClick={this.toggleQuestionnaire(true).bind(this)}>Yes</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" value="no" type="radio" checked />
									<span onClick={this.toggleQuestionnaire().bind(this)}>No</span>
								</label>
							</p>
						</form>
					</div>
					{this.state.showQuestionnaire ? <AlcoholQuestionnaire /> : ''}
				</div>
			</div>
		)
	}
}

const AlcoholQuestionnaire = () => (
	<div>
		<div className="col s12">
			<div className="row">
				<div className="col s12">
					<h5>What kind?</h5>
					<input id="alcohol-type" type="text" className="validate patient-history-input" data-form-key="alcohol-type" />
				</div>
				<div className="input-field col s12">
					<h5>How many drinks do you consume a week?</h5>
					<input id="alcohol-num" type="number" className="validate patient-history-input" data-form-key="alcohol-freq" value={1} />
				</div>
			</div>
		</div>
		<form className="col s12 patient-history-input" data-form-key="alcohol-concern" data-materialize-type="radio-group" action="">
			<h5>Are you concerned about how much you drink?</h5>
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
		<form className="col s12 patient-history-input" data-form-key="alcohol-consider-stopping" data-materialize-type="radio-group" action="">
			<h5>Have you considered stopping?</h5>
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
	</div>
)

export default Alcohol
