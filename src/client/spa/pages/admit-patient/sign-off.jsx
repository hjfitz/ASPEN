import {h} from 'preact'
import format from 'date-fns/format'
import {getJwtPayload} from '../../util'
import {SignatureBox} from '../../Partial'

const getName = () => getJwtPayload(localStorage.token).name
const getDate = () => format(Date.now(), ' MMM DD, YYYY')

const SignOff = () => (
	<div className="row">
		<h4>Sign-off</h4>
		<div className="col s12">
			<p>Please sign as the health professional taking this health history:</p>
			<div className="row">
				<div className="col s12">
					<div className="input-field col s12">
						<input id="practitioner-name" type="text" className="validate" disabled value={getName()} />
						<label className="active" htmlFor="practitioner-name">Name</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-designation" type="text" className="validate patient-history-input" data-form-key="sign-off-designation" />
						<label htmlFor="practitioner-designation">Designation</label>
					</div>
					<div className="input-field col s12">
						<input id="practitioner-date" type="text" className="validate datepicker patient-history-input" value={getDate()} data-form-key="sign-off-date" />
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
