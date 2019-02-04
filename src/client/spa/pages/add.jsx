import {h} from 'preact'
import {Link} from 'preact-router'

import '../styles/add.scss'

const Add = () => (
	<div className="row">
		<div className="col m6 s12">
			<Link href="/add/patient">
				<div className="card hoverable linked-card z-depth-2">
					<div className="card-image">
						<img src="/img/hospital-bed.png" alt="" />
					</div>
					<div className="card-content">
						<span className="card-title">Patient</span>
					Admit a new patient and their accompanying contact to a given location
					</div>
				</div>
			</Link>
		</div>
		<div className="col m6 s12">
			<Link href="/add/location">
				<div className="card hoverable linked-card z-depth-2">
					<div className="card-image">
						<img src="/img/pharmacy.png" alt="" />
					</div>
					<div className="card-content">
						<span className="card-title">Location</span>
					Create a new location to admit patients to!
					</div>
				</div>
			</Link>
		</div>
	</div>
)

export default Add
