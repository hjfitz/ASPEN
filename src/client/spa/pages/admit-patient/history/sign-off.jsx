import {h} from 'preact'
import format from 'date-fns/format'
import {getName, getJwtPayload} from '../../../util'
import SignatureBox from './signature-box'

const getDate = () => format(Date.now(), ' MMM DD, YYYY')

function getDesignation() {
	const payload = getJwtPayload(localStorage.token)
	if (payload.email.indexOf('@myport.ac.uk') > -1) return 'student'
	if (payload.email.indexOf('@port.ac.uk') > -1) return 'teacher'
	return 'unknown'
}

const SignOff = () => (
	<div className="row">
		<h4>Sign-off</h4>
		<div className="col s12">
			<p>Please sign as the health professional taking this health history:</p>
			<div className="row">
				<div className="col s12">
					<div className="input-field col s12">
						<input id="practitioner-name" type="text" className="validate" disabled value={getName()} data-form-key="sign-name" />
						<label className="active" htmlFor="practitioner-name">Name</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-designation" type="text" className="validate patient-history-input" value={getDesignation()} data-form-key="sign-designation" />
						<label className="active" htmlFor="practitioner-designation">Designation</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-date" type="text" className="validate datepicker patient-history-input" value={getDate()} data-form-key="sign-date" />
						<label className="active" htmlFor="practitioner-date">Date</label>
					</div>
				</div>
				<div className="input-field col s12">
					<SignatureBox />
				</div>
			</div>
		</div>
	</div>
)

export default SignOff
