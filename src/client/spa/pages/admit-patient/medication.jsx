import {h} from 'preact'

const Medication = () => (
	<div className="row">
		<div className="input-field col s12">
			<textarea id="scrip-meds" className="materialize-textarea patient-history-input" data-form-key="medication-prescription-medications" />
			<label htmlFor="scrip-meds">Prescribed medication taken (and dose + frequency)</label>
		</div>
		<div className="input-field col s12">
			<textarea id="otc-meds" className="materialize-textarea patient-history-input" data-form-key="medication-otc-medications" />
			<label htmlFor="otc-meds">Over the Counter medication taken (and dose+frequency)</label>
		</div>
		<div className="input-field col s12">
			<textarea id="allergies" className="materialize-textarea patient-history-input" data-form-key="medication-allergies" />
			<label htmlFor="allergies">Allergies</label>
		</div>
	</div>
)

export default Medication
