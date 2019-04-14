import {h, Component} from 'preact'

import {IncButton, DecButton} from './util'

class Medication extends Component {
	constructor() {
		super()
		this.state = {
			numScrip: 1,
			numOtc: 1,
			numAllergies: 1,
		}
		this.incScrip = this.inc('numScrip').bind(this)
		this.decScrip = this.dec('numScrip').bind(this)
		this.incOtc = this.inc('numOtc').bind(this)
		this.decOtc = this.dec('numOtc').bind(this)
		this.incAllergies = this.inc('numAllergies').bind(this)
		this.decAllergies = this.dec('numAllergies').bind(this)
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
				<h4>Medication</h4>
				<div>
					<h6>Prescription Medication</h6>
					<div className="patient-history-input" data-form-key="medication-prescription" data-materialize-type="multiple-input-group">
						{Array.from({length: this.state.numScrip}).map((_, idx) => (
							<div className="scrip-input row input-group">
								<div className="col m6 s12 input-field">
									<input id={`med-name-${idx}`} type="text" className={`validate name med-name-${idx}`} />
									<label htmlFor={`med-name-${idx}`}>Medication Name</label>
								</div>
								<div className="col m3 s12 input-field">
									<input id={`med-dose-${idx}`} type="text" className="validate dose" />
									<label htmlFor={`med-dose-${idx}`}>Dose</label>
								</div>
								<div className="col m3 s12 input-field">
									<input id={`med-freq-${idx}`} type="text" className="validate frequency" />
									<label htmlFor={`med-freq-${idx}`}>Frequency</label>
								</div>
							</div>
						))}
					</div>
					<div className="row">
						<IncButton onClick={this.incScrip} />
						<DecButton onClick={this.decScrip} />
					</div>
				</div>
				<div className="divider" />
				<div>
					<h6>Over the Counter Medication</h6>
					<div className="patient-history-input" data-form-key="medication-otc" data-materialize-type="multiple-input-group">
						{Array.from({length: this.state.numOtc}).map((_, idx) => (
							<div className="scrip-input row input-group">
								<div className="col m6 s12 input-field">
									<input id={`otc-med-name-${idx}`} type="text" className={`validate name otc-med-name-${idx}`} />
									<label htmlFor={`otc-med-name-${idx}`}>OTC Medication Name</label>
								</div>
								<div className="col m3 s12 input-field">
									<input id={`otc-med-dose-${idx}`} type="text" className="dose validate" />
									<label htmlFor={`otc-med-dose-${idx}`}>Dose</label>
								</div>
								<div className="col m3 s12 input-field">
									<input id={`otc-med-freq-${idx}`} type="text" className="frequency validate" />
									<label htmlFor={`otc-med-freq-${idx}`}>Frequency</label>
								</div>
							</div>
						))}
					</div>
					<div className="row">
						<IncButton onClick={this.incOtc} />
						<DecButton onClick={this.decOtc} />
					</div>
				</div>
				<div className="divider" />
				<div>
					<h6>Allergies</h6>
					<div className="patient-history-input" data-form-key="medication-allergies" data-materialize-type="input-group">
						{Array.from({length: this.state.numAllergies}).map((_, idx) => (
							<div className="row">
								<div className="col s12 input-field">
									<input id={`allergy-name-${idx}`} type="text" className="validate med-name" />
									<label htmlFor={`allergy-name-${idx}`}>Allergy</label>
								</div>
							</div>
						))}
					</div>
					<div className="row">
						<IncButton onClick={this.incAllergies} />
						<DecButton onClick={this.decAllergies} />
					</div>
				</div>

			</div>
		)
	}
}

export default Medication
