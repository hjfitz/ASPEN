import {h} from 'preact'
import {Link} from 'preact-router'

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
				<div className="col s6 l4">
					<div className="hoverable card home-card">
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
					<div className="hoverable card home-card">
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
					<div className="hoverable card home-card">
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
					<div className="hoverable card home-card">
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
