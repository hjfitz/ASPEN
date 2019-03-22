import {h} from 'preact'

const HealthHistory = () => (
	<div className="row">
		<div className="input-field col s6">
			<select multiple className="patient-details-select patient-history-input" data-form-key="personal-health-history-childhood-illnesses" data-materialize-type="select">
				<option value="" disabled selected>Select all that apply</option>
				<option value="Measles">Measles</option>
				<option value="Mumps">Mumps</option>
				<option value="Rubella">Rubella</option>
				<option value="Chickenpox">Chickenpox</option>
				<option value="Rheumatic Fever">Rheumatic Fever</option>
			</select>
			<label>Childhood Illnesses</label>
		</div>
		<div className="input-field col s6">
			<select multiple className="patient-details-select patient-history-input" data-form-key="personal-health-history-immunisations" data-materialize-type="select">
				<option value="" disabled selected>Select all that apply</option>
				<option value="Tetanus">Tetanus</option>
				<option value="Hepatitis">Hepatitis</option>
				<option value="Influenza">Influenza</option>
				<option value="MMR">MMR</option>
				<option value="Meningitis">Meningitis</option>
				<option value="Pneumonia">Pneumonia</option>
			</select>
			<label>Immunisations</label>
		</div>
		<div className="input-field col s12">
			<textarea id="medical-problems" className="materialize-textarea patient-history-input" data-form-key="personal-health-history-medical-problems" />
			<label htmlFor="medical-problems">Any Medical Problems</label>
		</div>
		<div className="input-field col s12">
			<textarea id="surgical-operations" className="materialize-textarea patient-history-input" data-form-key="personal-health-history-surgical-operations" />
			<label htmlFor="surgical-operations">Any Surgical Operations</label>
		</div>
		<div className="input-field col s12">
			<textarea id="other-hospitalisations" className="materialize-textarea patient-history-input" data-form-key="personal-health-history-other-hospitalisations" />
			<label htmlFor="other-hospitalisations">Any Other Hospitalisations</label>
		</div>
	</div>
)

export default HealthHistory
