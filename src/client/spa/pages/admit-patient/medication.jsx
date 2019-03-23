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
					{Array.from({length: this.state.numScrip}).map((_, idx) => (
						<div className="scrip-input row">
							<div className="col m6 s12 input-field">
								<input id="med-name" type="text" className={`validate med-name-${idx}`} />
								<label htmlFor="med-name">Medication Name</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id="med-dose" type="text" className="validate" />
								<label htmlFor="med-dose">Dose</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id="med-freq" type="text" className="validate" />
								<label htmlFor="med-freq">Frequency</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numScrip').bind(this)} />
						<DecButton onClick={this.dec('numScrip').bind(this)} />
					</div>
				</div>
				<div className="divider" />
				<div>
					<h6>Over the Counter Medication</h6>
					{Array.from({length: this.state.numOtc}).map((_, idx) => (
						<div className="scrip-input row">
							<div className="col m6 s12 input-field">
								<input id="otc-med-name" type="text" className={`validate otc-med-name-${idx}`} />
								<label htmlFor="otc-med-name">OTC Medication Name</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id="otc-med-dose" type="text" className="validate" />
								<label htmlFor="otc-med-dose">Dose</label>
							</div>
							<div className="col m3 s12 input-field">
								<input id="otc-med-freq" type="text" className="validate" />
								<label htmlFor="otc-med-freq">Frequency</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numOtc').bind(this)} />
						<DecButton onClick={this.dec('numOtc').bind(this)} />
					</div>
				</div>
				<div className="divider" />
				<div>
					<h6>Allergies</h6>
					{Array.from({length: this.state.numAllergies}).map(() => (
						<div className="row">
							<div className="col s12 input-field">
								<input id="allergy-name" type="text" className="validate med-name" />
								<label htmlFor="allergy-name">Allergy</label>
							</div>
						</div>
					))}
					<div className="row">
						<IncButton onClick={this.inc('numAllergies').bind(this)} />
						<DecButton onClick={this.dec('numAllergies').bind(this)} />
					</div>
				</div>

			</div>
		)
	}
}

export default Medication
