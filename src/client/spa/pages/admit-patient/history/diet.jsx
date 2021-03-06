import {h} from 'preact'

/**
 * @returns {preact.VNode}
 */
const Diet = () => (
	<div className="row">
		<h4>Diet</h4>
		<form className="col s12 patient-history-input" data-form-key="diet-dieting" data-materialize-type="radio-group" action="">
			<h5>Are you dieting?</h5>
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
		<form className="col s12 patient-history-input" data-form-key="diet-difficulties-eating" data-materialize-type="radio-group" action="">
			<h5>Do you have any difficulties in eating or drinking?</h5>
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
		<div className=" col s12 input-field">
			<h5>How many meals do you eat per day?</h5>
			<input id="meals_eaten" type="number" value={3} data-form-key="diet-meals-eaten" className="validate patient-history-input" />
		</div>
	</div>
)

export default Diet
