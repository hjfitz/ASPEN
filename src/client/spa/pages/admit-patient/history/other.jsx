import {h} from 'preact'

/**
 * @returns {preact.VNode}
 */
const OtherQuestions = () => (
	<div className="row">
		<h4>Other Questions</h4>
		<div className="input-field col s12">
			<h5>Mental Health and Wellbeing</h5>
			<textarea id="mental-health-wellbeing" className="materialize-textarea patient-history-input" data-form-key="other-mental-health-wellbeing" />
		</div>
		<div className="input-field col s12">
			<h5>Social History</h5>
			<textarea id="social-history" className="materialize-textarea patient-history-input" data-form-key="other-social-history" />
		</div>
		<div className="input-field col s12">
			<h5>Are you aware of any history with Cancer, Hypertension, Diabetes</h5>
			<textarea id="family-history" className="materialize-textarea patient-history-input" data-form-key="other-family-history" />
		</div>
		<div className="input-field col s12">
			<h5>Other Relevant History</h5>
			<textarea id="relevant-history" className="materialize-textarea patient-history-input" data-form-key="other-relevant-history" />
		</div>
	</div>
)

export default OtherQuestions
