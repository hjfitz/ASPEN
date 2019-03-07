import {h} from 'preact'
import format from 'date-fns/format'

import '../styles/history-report.scss'

const formatDate = date => format(new Date(date), ' MMM DD, YYYY')

const HistoryReport = (props) => {
	if (!props.reportLoaded) {
		return (
			<div id="modal1" className="modal history-report-modal">
				<div className="modal-content" />
			</div>
		)
	}

	return (
		<div id="modal1" className="modal history-report-modal">
			<div className="modal-content">
				<h3>History: {props.patientName}</h3>
				<div className="divider" />
				<h4>Personal Health History</h4>
				<p><b>Childhood illnesses:</b></p>
				<ul className="browser-default">
					{props.personal_health_history_childhood_illnesses.split(',').map(illness => (
						<li>{illness}</li>
					))}
				</ul>
				<p><b>Immunisations:</b></p>
				<ul className="browser-default">
					{props.personal_health_history_immunisations.split(',').map(immun => (
						<li>{immun}</li>
					))}
				</ul>
				<p><b>Medical Problems:</b></p>
				<p>{props.personal_health_history_medical_problems}</p>
				<p><b>Surgical Operations:</b></p>
				<p>{props.personal_health_history_surgical_operations}</p>
				<p><b>Other Hospitalisations:</b></p>
				<p>{props.personal_health_history_other_hospitalisations}</p>
				<div className="divider" />
				<h4>Medication</h4>
				<p><b>Prescribed Medication: </b>{props.medication_prescription_medications}</p>
				<p><b>OTC Medication: </b>{props.medication_otc_medications}</p>
				<p><b>Allergies: </b>{props.medication_allergies}</p>
				<div className="divider" />
				<h4>Health Habits and Personal Safety</h4>
				<h5>Exercise</h5>
				<p>{props.health_habits_exercise_frequency}</p>
				<h5>Diet</h5>
				<p><b>Dieting: </b>{props.health_habits_dieting}</p>
				<p><b>Meals eaten daily: </b>{props.health_habits_meals_eaten}</p>
				<p><b>Difficulty Eating: </b>{props.health_habits_difficulties_eating}</p>
				<h5>Alcohol</h5>
				<p><b>Drinks alcohol: </b>{props.health_habits_drink_alcohol}</p>
				<p><b>Kind of alcohol: </b>{props.health_habits_alcohol_type === '' ? 'Not Specified' : props.health_habits_alcohol_type}</p>
				<p><b>Drinks per week: </b>{props.health_habits_alcohol_num}</p>
				<p><b>Concerned about alcohol intake: </b>{props.health_habits_drink_alcohol_concern}</p>
				<p><b>Considered stopping: </b>{props.health_habits_drink_alcohol_consider_stopping}</p>
				<h5>Tobacco</h5>
				<p><b>Used tobacco in past 5 years: </b>{props.health_habits_tobacco_used_prior}</p>
				<p><b>Currently using Tobacco:</b>{props.health_habits_current_tobacco_use}</p>
				<pre>{props.health_habits_types_tobacco_used}</pre>
				<p><b>Nicotine replacement therapy in use: </b>{props.health_habits_nicotine_replace_therapy}</p>
				<p><b>Nicotine replacement therapy types: </b>{props.health_habits_nicotine_replacement_types === '' ? 'Not specified' : props.health_habits_nicotine_replacement_types}</p>
				<h5>Drugs</h5>
				<p><b>Currently using recreational drugs/substances: </b>{props.health_habits_current_drug_use}</p>
				<p><b>Drug use frequency: </b>{props.health_habits_drug_use_frequency === '' ? 'Not Specified' : props.health_habits_drug_use_frequency}</p>
				<p><b>Ever injected recreational drugs with a needle: </b>{props.health_habits_patient_ever_injected_drugs}</p>
				<h5>Mental Health and Wellbeing</h5>
				<pre>{props.health_habits_mental_health_wellbeing}</pre>
				<h5>Social History</h5>
				<pre>{props.health_habits_social_history}</pre>
				<h5>Family History</h5>
				<pre>{props.health_habits_family_history}</pre>
				<h5>Other Relevant History</h5>
				<pre>{props.health_habits_relevant_history}</pre>
				<div className="divider" />
				<h4>Sign-off</h4>
				<p><b>Compiled at: </b>{formatDate(props.sign_off_date)}</p>
				<p><b>Compiled by: </b>{props.name}</p>
				<p><b>Designation: </b>{props.sign_off_designation}</p>
				<p><b>Signature:</b></p>
				<img src={props.sign_off_blob} alt="Signature" />
			</div>
		</div>
	)
}

export default HistoryReport
