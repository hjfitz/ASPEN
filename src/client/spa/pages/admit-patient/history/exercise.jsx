import {h} from 'preact'

const Exercise = () => (
	<div className="row">
		<h4>Exercise</h4>
		<div className="col s12">

			<h5>How frequently do you exercise?</h5>
			<form className="patient-history-input" data-form-key="exercise-frequency" data-materialize-type="radio-group" action="">
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
	</div>
)

export default Exercise
