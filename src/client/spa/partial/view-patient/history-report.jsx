import {h} from 'preact'
import format from 'date-fns/format'

import '../../styles/history-report.scss'

const formatDate = date => format(new Date(date), ' MMM DD, YYYY')

const DrugTable = props => (
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Dose</th>
				<th>Frequency</th>
			</tr>
		</thead>
		<tbody>
			{props.drugs.map(drug => (
				<tr>
					<td>{drug.medication_name}</td>
					<td>{drug.medication_dose}</td>
					<td>{drug.medication_frequency}</td>
				</tr>
			))}
		</tbody>
	</table>
)

const HistoryReport = (props) => {
	if (!props.reportLoaded) {
		return (
			<div id="modal1" className="modal history-report-modal">
				<div className="modal-content" />
			</div>
		)
	}

	console.log(props)
	const prescriptionDrugs = props.drugs.prescriptions[0].filter(drug => drug.medication_name)
	const otcDrugs = props.drugs.otc[0].filter(drug => drug.medication_name)
	const recreationalDrugs = (props.drugs.recreational[0] || []).filter(drug => drug.medication_name)
	// console.log({otcDrugs, recreationalDrugs, prescriptionDrugs})
	console.log(otcDrugs)
	return (
		<div id="modal1" className="modal history-report-modal">
			<div className="modal-content">
				<h3>History: {props.patientName}</h3>
				<div className="divider" />
				<section>
					<h4>Personal Health History</h4>
					<p><b>Childhood illnesses:</b></p>
					<ul className="browser-default">
						{(props.childhood_illnesses || []).map(illness => (<li>{illness}</li>))}
					</ul>
					<p><b>Immunisations:</b></p>
					<ul className="browser-default">
						{(props.immunisations || []).map(immun => (<li>{immun}</li>))}
					</ul>
					<p><b>Medical Problems:</b></p>
					<ul className="browser-default">
						{(props.medical_issues || []).map(immun => (<li>{immun}</li>))}
					</ul>
					<p><b>Surgical Operations:</b></p>
					<ul className="browser-default">
						{(props.surgical_operations || []).map(immun => (<li>{immun}</li>))}
					</ul>
					<p><b>Other Hospitalisations:</b></p>
					<ul className="browser-default">
						{(props.other_hospitalisations || []).map(immun => (
							<li>{immun}</li>
						))}
					</ul>
				</section>
				<div className="divider" />
				<section>
					<h4>Medication</h4>
					<p><b>Prescribed Medication: </b></p>
					{prescriptionDrugs.length ? <DrugTable drugs={prescriptionDrugs} /> : ''}
					<p><b>OTC Medication: </b></p>
					{otcDrugs.length ? <DrugTable drugs={otcDrugs} /> : ''}
					<p><b>Allergies: </b>{props.medication_allergies}</p>
					<div className="divider" />
					<h4>Health Habits and Personal Safety</h4>
				</section>
				<section>
					<h5>Exercise</h5>
					<p><b>Frequency: </b>{props.exercise_frequency}</p>
				</section>
				<section>
					<h5>Diet</h5>
					<p><b>Dieting: </b>{props.dieting ? 'yes' : 'no'}</p>
					<p><b>Meals eaten daily: </b>{props.meals_daily}</p>
					<p><b>Difficulty Eating: </b>{props.difficulties_eating ? 'yes' : 'no'}</p>
				</section>
				<section>
					<h5>Alcohol</h5>
					<p><b>Drinks alcohol: </b>{props.drink_alcohol ? 'yes' : 'no'}</p>
					{props.drink_alcohol
						? (
							<div>
								<p><b>Kind of alcohol: </b>{props.health_habits_alcohol_type === '' ? 'Not Specified' : props.health_habits_alcohol_type}</p>
								<p><b>Drinks per week: </b>{props.health_habits_alcohol_num}</p>
								<p><b>Concerned about alcohol intake: </b>{props.health_habits_drink_alcohol_concern}</p>
								<p><b>Considered stopping: </b>{props.health_habits_drink_alcohol_consider_stopping}</p>
							</div>
						)
						: ''}
				</section>
				<section>
					<h5>Tobacco</h5>
					<p><b>Used tobacco in past 5 years: </b>{props.tobacco_last_smoked ? 'yes' : 'no'}</p>
					{props.tobacco_last_smoked
						? (
							<div>
								<p><b>Currently using Tobacco:</b>{props.currently_uses_tobacco}</p>
								<pre>Types of Tobacco used: {props.tobacco_type}</pre>
								<p><b>Nicotine replacement therapy in use: </b>{props.currently_uses_tobacco_repalcement}</p>
								<p><b>Nicotine replacement therapy types: </b>{props.tobacco_replacement_type === '' ? 'Not specified' : props.tobacco_replacement_type}</p>
							</div>
						)
						: ''}
				</section>
				<section>
					<h5>Drugs</h5>
					<p><b>Currently using recreational drugs/substances: </b>{props.uses_recreational_drugs ? 'yes' : 'no'}</p>
					{props.uses_recreational_drugs ? (
						<div>
							{recreationalDrugs.length ? <DrugTable drugs={recreationalDrugs} /> : ''}
							<p><b>Ever injecthealth_habits_patient_ever_injected_drugsed recreational drugs with a needle: </b>{props.used_recreational_with_needle ? 'yes' : 'no'}</p>
						</div>
					) : ''}
				</section>
				<div className="divider" />
				<section>
					<h4>Other Questions</h4>
					<h5>Mental Health and Wellbeing</h5>
					<pre>{props.mental_health_history}</pre>
					<h5>Social History</h5>
					<pre>{props.social_history}</pre>
					<h5>Family History</h5>
					<pre>{props.family_history}</pre>
					<h5>Other Relevant History</h5>
					<pre>{props.relevant_history}</pre>
				</section>
				<div className="divider" />
				<section>
					<h4>Sign-off</h4>
					<p><b>Compiled at: </b>{formatDate(props.date)}</p>
					<p><b>Compiled by: </b>{props.practitioner.name}</p>
					<p><b>Designation: </b>{props.practitioner_designation}</p>
					<p><b>Signature:</b></p>
					<img src={props.signature_blob} alt="Signature" />
				</section>
			</div>
		</div>
	)
}

export default HistoryReport
