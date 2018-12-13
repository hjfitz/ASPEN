import {h} from 'preact'

const SubmissionScreen = props => (
	<section className="patient-input">
		<h2>Submit details for {props.title}. {props.surname}</h2>
		<div>
			<label htmlFor="resp">Respiration Rate (BPM)
				<input type="number" id="resp" name="resp" required />
			</label>
		</div>

		<div>
			<label htmlFor="oxy-sat">Oxygen Saturation %
				<input type="number" id="oxy-sat" name="oxy-sat" required />
			</label>
		</div>

		<div>
			<label htmlFor="oxy-supp">Supplemental Oxygen
				<input type="number" id="oxy-supp" name="oxy-supp" required />
			</label>
		</div>
		<div>
			<label htmlFor="temp">Temperature °C
				<input type="number" id="temp" name="temp" required />
			</label>
		</div>
		<div>
			<label htmlFor="bp">Blood Pressure (mmHg)
				<input type="number" id="bp" name="bp" required />
			</label>
		</div>
		<div>
			<label htmlFor="h-rate">Heart Rate (BPM)
				<input type="number" id="h-rate" name="h-rate" required />
			</label>
		</div>
		<div>
			<label htmlFor="consc">Level of Consciousness
				<input type="string" id="consc" name="consc" required />
			</label>
		</div>
		<span className="btn" onClick={props.submit}>submit</span>
	</section>
)

export default SubmissionScreen
