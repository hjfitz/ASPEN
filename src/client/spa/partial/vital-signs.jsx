import {h, Component} from 'preact'
import M from 'materialize-css'

import '../styles/vital-signs.scss'

class Vitals extends Component {
	componentDidMount() {
		const tabs = document.querySelectorAll('.tabs')
		const select = document.querySelectorAll('select')
		M.FormSelect.init(select)
		M.Tabs.init(tabs, {swipeable: true})
	}

	render() {
		return (
			<div className="card">
				<div className="card-tabs">
					<ul className="tabs tabs-fixed-width">
						<li className="tab"><a className="active" href="#record">Record Vital Signs</a></li>
						<li className="tab"><a href="#history">Previous Vital Signs</a></li>
					</ul>
				</div>
				<div className="card-content">
					<div id="record">
						<div className="row">
							<form action="" className="col s12">

								<div className="row">
									<div className="input-field col s6">
										<input id="resp-rate" type="number" className="validate" />
										<label htmlFor="resp-rate">Respiratory Rate</label>
									</div>
									<div className="input-field col s6">
										<input id="oxy-sat" type="number" className="validate" />
										<label htmlFor="oxy-sat">Oxygen Saturation</label>
									</div>
								</div>

								<div className="row">
									<div className="input-field col s6">
										<input id="heart-rate" type="number" className="validate" />
										<label htmlFor="heart-rate">Heart Rate</label>
									</div>
									<div className="input-field col s6">
										<input id="body-temp" type="number" className="validate" />
										<label htmlFor="body-temp">Body Temperature</label>
									</div>
								</div>

								<div className="row">
									<div className="input-field col s6">
										<input id="syst-bp" type="number" className="validate" />
										<label htmlFor="syst-bp">Systolic Blood Pressure</label>
									</div>
									<div className="input-field col s6">
										<select>
											<option value="" disabled selected>Choose your option</option>
											<option value="A">Aware</option>
											<option value="D">Drowzy</option>
											<option value="U">Unconscious</option>
										</select>
										<label>Level of Consciousness</label>
									</div>

								</div>

								<div className="row">
									<div className="col s6">
										<p>
											<label>
												<input name="supp-oxy" type="checkbox" />
												<span>Supplemental Oxygen</span>
											</label>
										</p>
									</div>
									<div className="col s6">
										<a className="waves-effect waves-light btn">Submit</a>
									</div>

								</div>

							</form>
						</div>

					</div>
					<div id="history">Test 3</div>
				</div>
			</div>
		)
	}
}

export default Vitals
