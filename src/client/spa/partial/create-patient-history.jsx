import {h} from 'preact'
import format from 'date-fns/format'
import {getJwtPayload} from '../util'
import {SignatureBox} from '../Partial'

const getName = () => getJwtPayload(localStorage.token).name
const getDate = () => format(Date.now(), ' MMM DD, YYYY')


const PatientHistory = () => (
	<div className="row">
		<div className="col s12">
			<h3>Personal Health History</h3>
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
		</div>
		<div className="col s12">
			<h3>Medication</h3>
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
		</div>
		<div className="col s12">
			<h3>Health Habits and Personal Safety</h3>
			<div className="row">
				<div className="col s12">
					<h4>How frequently do you exercise?</h4>
					<form className="col s12 patient-history-input" data-form-key="health-habits-exercise-frequency" data-materialize-type="radio-group" action="">
						<p>
							<label>
								<input className="with-gap" name="group1" type="radio" value="sedentary" checked />
								<span>Sedentary (no exercise)</span>
							</label>
						</p>
						<p>
							<label>
								<input className="with-gap" name="group1" value="mild" type="radio" />
								<span>Mild Exercise (climb stairs, regular warks)</span>
							</label>
						</p>
						<p>
							<label>
								<input className="with-gap" name="group1" value="occasional" type="radio" />
								<span>Occasional vigorous exercise (&lt;4 times/week for 30 min)</span>
							</label>
						</p>
						<p>
							<label>
								<input className="with-gap" name="group1" value="vigorous" type="radio" />
								<span>Regular vigorous exercise (&gt;4 times/week for 30 min)</span>
							</label>
						</p>
					</form>
				</div>
				<div className="col s12">
					<h4>Diet</h4>
					<form className="col s6 patient-history-input" data-form-key="health-habits-dieting" data-materialize-type="radio-group" action="">
						<h6>Are you dieting?</h6>
						<p>
							<label>
								<input className="with-gap" name="group1" type="radio" value="no" checked />
								<span>No</span>
							</label>
						</p>
						<p>
							<label>
								<input className="with-gap" name="group1" type="radio" value="yes" />
								<span>Yes</span>
							</label>
						</p>
					</form>
					<form className="col s6 patient-history-input" data-form-key="health-habits-difficulties-eating" data-materialize-type="radio-group" action="">
						<h6>Do you have any difficulties in eating or drinking?</h6>
						<p>
							<label>
								<input className="with-gap" name="group1" type="radio" value="no" checked />
								<span>No</span>
							</label>
						</p>
						<p>
							<label>
								<input className="with-gap" name="group1" type="radio" value="yes" />
								<span>Yes</span>
							</label>
						</p>
					</form>
					<div className=" col s6 input-field">
						<h6>How many meals do you eat per day?</h6>
						<input id="meals_eaten" type="number" value={3} data-form-key="health-habits-meals-eaten" className="validate patient-history-input" />
					</div>
				</div>
				<div className="col s12">
					<h4>Alcohol</h4>
					<div className="row">
						<form className="col s12 m6 patient-history-input" data-form-key="health-habits-drink-alcohol" data-materialize-type="radio-group" action="">
							<h6>Do you drink alcohol?</h6>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="no" checked />
									<span>No</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" value="yes" type="radio" />
									<span>yes</span>
								</label>
							</p>
						</form>
						<div className="col s12 m6">
							<div className="row">
								<div className="col s12">
									<h6>If yes, which kind?</h6>
									<input id="alcohol-type" type="text" className="validate patient-history-input" data-form-key="health-habits-alcohol-type" />
								</div>
								<div className="input-field col s12">
									<h6>How many drinks per week?</h6>
									<input id="alcohol-num" type="number" className="validate patient-history-input" data-form-key="health-habits-alcohol-num" value={1} />
								</div>
							</div>
						</div>
						<form className="col s6 patient-history-input" data-form-key="health-habits-drink-alcohol-concern" data-materialize-type="radio-group" action="">
							<h6>Are you concerned about how much you drink?</h6>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="no" checked />
									<span>No</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="yes" />
									<span>Yes</span>
								</label>
							</p>
						</form>
						<form className="col s6 patient-history-input" data-form-key="health-habits-drink-alcohol-consider-stopping" data-materialize-type="radio-group" action="">
							<h6>Have you considered stopping?</h6>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="no" checked />
									<span>No</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="yes" />
									<span>Yes</span>
								</label>
							</p>
						</form>
					</div>
				</div>
				<div className="col s12">
					<h4>Tobacco</h4>
					<div className="row">
						<div className="col s12">
							<div className="row">
								<form className="col s6 patient-history-input" data-form-key="health-habits-tobacco-used-prior" data-materialize-type="radio-group" action="">
									<h6>Have you used Tobacco in the last 5 years?</h6>
									<p>
										<label>
											<input className="with-gap" name="group1" type="radio" value="no" checked />
											<span>No</span>
										</label>
									</p>
									<p>
										<label>
											<input className="with-gap" name="group1" type="radio" value="yes" />
											<span>Yes</span>
										</label>
									</p>
								</form>
								<div className="col s6">
									<h6>If you have given up, when did you last smoke?</h6>
									<input type="text" className="datepicker" />
								</div>
							</div>
						</div>
						<form className="col s6 patient-history-input" data-form-key="health-habits-current-tobacco-use" data-materialize-type="radio-group" action="">
							<h6>Are you currently using Tobacco?</h6>
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
						<div className="input-field col s6 tooltipped" data-position="top" data-tooltip="Include Cigarettes, Pipe and Cigars">
							<h6>If you're currently using tobacco, which are you using?</h6>
							<textarea id="tobacco-used" className="materialize-textarea  patient-history-input" data-form-key="health-habits-types-tobacco-used" />
						</div>
						<form className="col s6 patient-history-input" data-form-key="health-habits-nicotine-replace-therapy" data-materialize-type="radio-group" action="">
							<h6>Are you currently using nicotine replacement therapy?</h6>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="no" checked />
									<span>No</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" type="radio" value="yes" />
									<span>Yes</span>
								</label>
							</p>
						</form>
						<div className="input-field col s6">
							<select className="patient-details-select patient-history-input" data-form-key="health-habits-nicotine-replacement-types" data-materialize-type="select">
								<option value="" disabled selected>Select one</option>
								<option value="">dont know</option>
								<option value="">which types</option>
								<option value="">exist out there</option>
								<option value="">yet</option>
							</select>
							<label>If yes, which type?</label>
						</div>
					</div>
				</div>
				<div className="col s12">
					<h4>Drugs</h4>
					<div className="row">
						<form className="col s6 patient-history-input" data-form-key="health-habits-current-drug-use" data-materialize-type="radio-group" action="">
							<h6>Do you currently use recreational drugs/substances?</h6>
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
						<div className="input-field col s6">
							<h6>If yes, which type and how frequently?</h6>
							<textarea id="drugs-used" className="materialize-textarea patient-history-input" data-form-key="health-habits-drug-use-frequency" />
						</div>
					</div>
					<div className="row">
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
				</div>
				<div className="col s12">
					<h4>Mental Health and Wellbeing</h4>
					<div className="row">
						<div className="input-field col s12 tooltipped">
							<h6>Mental Health and Wellbeing</h6>
							<textarea id="mental-health-wellbeing" className="materialize-textarea patient-history-input" data-form-key="health-habits-mental-health-wellbeing" />
						</div>
					</div>
				</div>
				<div className="col s12">
					<h4>Social History</h4>
					<div className="row">
						<div className="input-field col s12 tooltipped">
							<h6>Social History</h6>
							<textarea id="social-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-social-history" />
						</div>
					</div>
				</div>
				<div className="col s12">
					<h4>Family History</h4>
					<div className="row">
						<div className="input-field col s12 tooltipped">
							<h6>Are you aware of any history with Cancer, Hypertension, Diabetes</h6>
							<textarea id="family-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-family-history" />
						</div>
					</div>
				</div>
				<div className="col s12">
					<h4>Any other relevant History</h4>
					<div className="row">
						<div className="input-field col s12 tooltipped">
							<h6>Relevant History</h6>
							<textarea id="relevant-history" className="materialize-textarea patient-history-input" data-form-key="health-habits-relevant-history" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="col s12">
			<h3>Sign-off</h3>
			<p>Please sign as the health professional taking this health history:</p>
			<div className="row">
				<div className="col s12 m6">
					<div className="input-field col s12">
						<input id="practitioner-name" type="text" className="validate" value={getName()} />
						<label className="active" htmlFor="practitioner-name">Name</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-designation" type="text" className="validate patient-history-input" data-form-key="sign-off-designation" />
						<label htmlFor="practitioner-designation">Designation</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-date" type="text" className="validate datepicker patient-history-input" value={getDate()} data-form-key="sign-off-date" />
						<label className="active" htmlFor="practitioner-date">Date</label>
					</div>
				</div>
				<div className="input-field col s12 m6">
					<SignatureBox />
				</div>
			</div>
		</div>
	</div>
)

export default PatientHistory
