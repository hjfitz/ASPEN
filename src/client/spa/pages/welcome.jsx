import {h} from 'preact'
import {Link} from 'preact-router'

import {getName, getJwtPayload} from '../util'

import '../styles/welcome.scss'

const getGiven = () => getJwtPayload(localStorage.token).given_name

/**
 * Welcome page
 * @return {VNode} Welcome page
 */
const Welcome = () => (
	<div className="row">
		<div className="col s12">
			<header>
				<h1>Hi {getGiven()}! Welcome to ASPEN</h1>
			</header>
		</div>
		<div className="col s12">
			<div className="row">
				<div className="col s12">
					<div className="card blue-grey darken-1">
						<div className="card-content white-text">
							<span className="card-title">Warning!</span>
							<p>This project is in heavy development and subject to change, break and even disappear</p>
							<p>Source code for this program can be found <a native className="orange-text text-lighten-2" href="https://github.com/hjfitz/fyp">on GitHub.</a></p>
							<p>JSDoc can be found <a native className="orange-text text-lighten-2" href="/docs/js">on /docs/js</a></p>
							<p>API Documentation is hosted using Swagger<a native className="orange-text text-lighten-2" href="/docs/api"> and is available at /docs/api</a></p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="col s12">
			<div className="row">
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/wards">
							<div className="card-content">
								<span className="card-title">View your wards</span>
								<p>View wards in the practice and access patient details.</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/search/patient">
							<div className="card-content">
								<span className="card-title">Search for a Patient's Vital signs</span>
								<p>Search by details for a given patient.</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/add/patient">
							<div className="card-content">
								<span className="card-title">Admit a Patient</span>
								<p>Create a new patient, including their photograph and history.</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/add/ward">
							<div className="card-content">
								<span className="card-title">Create a ward</span>
								<p>Create a new ward to group patients in.</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/permissions">
							<div className="card-content">
								<span className="card-title">Manage Permissions</span>
								<p>Enable practitioners to access different patients.</p>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</div>
)

export default Welcome
