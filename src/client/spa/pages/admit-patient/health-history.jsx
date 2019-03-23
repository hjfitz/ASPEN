import {h, Component} from 'preact'

import {IncButton, DecButton} from './util'

class HealthHistory extends Component {
	constructor() {
		super()
		this.state = {
			numProbs: 1,
			numOps: 1,
			numOth: 1,
		}
	}

	inc(type) {
		return () => this.setState({[type]: this.state[type] + 1})
	}

	dec(type) {
		return () => this.setState({[type]: this.state[type] - 1})
	}

	render() {
		return (
			<div className="row">
				<h4>Health History</h4>
				<div className="input-field col s12 m6">
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
				<div className="input-field col s12 m6">
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
				<div className="col s12">
					<h6>Medical Issues</h6>
					{Array.from({length: this.state.numProbs}).map((_, idx) => (
						<div className="row">
							<div className="col s12 input-field">
								<input id="med-name" type="text" className={`validate med-name-${idx}`} />
								<label htmlFor="med-name">Medical Problem</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numProbs').bind(this)} />
						<DecButton onClick={this.dec('numProbs').bind(this)} />
					</div>
				</div>
				<div className="col s12">
					<h6>Surgical Operations</h6>
					{Array.from({length: this.state.numOps}).map((_, idx) => (
						<div className="row">
							<div className="col s12 input-field">
								<input id="med-name" type="text" className={`validate med-name-${idx}`} />
								<label htmlFor="med-name">Operation</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numOps').bind(this)} />
						<DecButton onClick={this.dec('numOps').bind(this)} />
					</div>
				</div>
				<div className="input-field col s12">
					<h6>Other Hospitalisations</h6>
					{Array.from({length: this.state.numOth}).map((_, idx) => (
						<div className="row">
							<div className="col s12 input-field">
								<input id="med-name" type="text" className={`validate med-name-${idx}`} />
								<label htmlFor="med-name">Hospitalisation Reason</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numOth').bind(this)} />
						<DecButton onClick={this.dec('numOth').bind(this)} />
					</div>
				</div>
			</div>
		)
	}
}

export default HealthHistory
