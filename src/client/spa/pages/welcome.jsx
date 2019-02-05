import {h} from 'preact'
import {Link} from 'preact-router'

import '../styles/welcome.scss'

/**
 * Welcome page
 * @return {VNode} Welcome page
 */
const Welcome = () => (
	<div className="row">
		<div className="col s12">
			<header>
				<h1>What would you like to do?</h1>
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
								<p>I am a very simple card. I am good at containing small bits of information.
					I am convenient because I require little markup to use effectively.
								</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/search/patient">
							<div className="card-content">
								<span className="card-title">Search for a Patient's Vital signs</span>
								<p>I am a very simple card. I am good at containing small bits of information.
					I am convenient because I require little markup to use effectively.
								</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/add/patient">
							<div className="card-content">
								<span className="card-title">Admit a Patient</span>
								<p>I am a very simple card. I am good at containing small bits of information.
					I am convenient because I require little markup to use effectively.
								</p>
							</div>
						</Link>
					</div>
				</div>
				<div className="col s6 l4">
					<div className="hoverable card little home-card">
						<Link href="/add/ward">
							<div className="card-content">
								<span className="card-title">Create a ward</span>
								<p>I am a very simple card. I am good at containing small bits of information.
					I am convenient because I require little markup to use effectively.
								</p>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</div>
)

export default Welcome
