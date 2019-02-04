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
			<ul>
				<li><Link href="/add/ward">Add a new location</Link></li>
				<li><Link href="/add/patient">Admit a new patient</Link></li>
				<li><Link href="/wards">View all wards</Link></li>
				<li><Link href="/search/patient">Search for a patient</Link></li>
			</ul>
		</div>
	</div>
)

export default Welcome
