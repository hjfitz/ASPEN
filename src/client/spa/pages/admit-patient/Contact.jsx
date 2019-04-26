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
				<Input id="contact-prefix" label="Title" />
				<Input id="contact-given" label="First Name" />
				<Input id="contact-family" label="Surname" />
				<Input id="contact-fullname" label="Full Name" />
				<Input id="contact-phone" label="Phone" type="tel" />
			</div>
		</div>
	</div>
)

export default Contact
