import {h} from 'preact'

const OtherQuestions = () => (
	<div className="row">
		<div className="col s12">
			<h4>Mental Health and Wellbeing</h4>
			<div className="row">
				<div className="input-field col s12">
					<h6>Mental Health and Wellbeing</h6>
					<textarea id="mental-health-wellbeing" className="materialize-textarea patient-history-input" data-form-key="health-habits-mental-health-wellbeing" />
				</div>
			</div>
		</div>
		<div className="col s12">
			<h4>Social History</h4>
			<div className="row">
				<div className="input-field col s12">
					<h6>Social History</h6>
					<textarea id="social-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-social-history" />
				</div>
			</div>
		</div>
		<div className="col s12">
			<h4>Family History</h4>
			<div className="row">
				<div className="input-field col s12">
					<h6>Are you aware of any history with Cancer, Hypertension, Diabetes</h6>
					<textarea id="family-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-family-history" />
				</div>
			</div>
		</div>
		<div className="col s12">
			<h4>Any other relevant History</h4>
			<div className="row">
				<div className="input-field col s12">
					<h6>Relevant History</h6>
					<textarea id="relevant-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-relevant-history" />
				</div>
			</div>
		</div>
	</div>
)

export default OtherQuestions
