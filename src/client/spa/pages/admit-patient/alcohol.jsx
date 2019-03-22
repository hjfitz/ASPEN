import {h, Component} from 'preact'

class Alcohol extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showQuestionnaire: false,
		}
	}

	render() {
		return (
			<div className="row">
				<div className="col s12">
					<h4>Alcohol</h4>
					<div className="row">
						<form className="col s12 patient-history-input" data-form-key="health-habits-drink-alcohol" data-materialize-type="radio-group" action="">
							<h5>Do you drink alcohol?</h5>
							<p>
								<label>
									<input className="with-gap" name="group1" value="yes" type="radio" />
									<span>Yes</span>
								</label>
							</p>
							<p>
								<label>
									<input className="with-gap" name="group1" value="no" type="radio" checked />
									<span>No</span>
								</label>
							</p>
						</form>
						<div className="col s12">
							<div className="row">
								{/* add a state hook on prev button press to show this */}
								<div className="col s12">
									<h5>If yes, which types?</h5>
									<input id="alcohol-type" type="text" className="validate patient-history-input" data-form-key="health-habits-alcohol-type" />
								</div>
								<div className="input-field col s12">
									<h5>How many drinks do you consum a week?</h5>
									<input id="alcohol-num" type="number" className="validate patient-history-input" data-form-key="health-habits-alcohol-num" value={1} />
								</div>
							</div>
						</div>
						<form className="col s12 patient-history-input" data-form-key="health-habits-drink-alcohol-concern" data-materialize-type="radio-group" action="">
							<h5>Are you concerned about how much you drink?</h5>
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
						<form className="col s12 patient-history-input" data-form-key="health-habits-drink-alcohol-consider-stopping" data-materialize-type="radio-group" action="">
							<h5>Have you considered stopping?</h5>
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
					</div>
				</div>
			</div>
		)
	}
}

export default Alcohol
