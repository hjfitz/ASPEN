import {h} from 'preact'

import {Input} from '../../Partial'

/**
 * basic contact info form
 * @returns {preact.VNode}
 */
const Contact = () => (
	<div>
		<h3>Contact Details</h3>
		<div className="card-panel z-depth-2">
			<div className="row">
				<Input id="contact-prefix" label="Title" className="s12 m6" />
				<Input id="contact-given" label="First Name" className="s12 m6" />
				<Input id="contact-family" label="Surname" className="s12 m6" />
				<Input id="contact-phone" label="Phone" type="tel" className="s12 m6" />
			</div>
		</div>
	</div>
)

export default Contact
