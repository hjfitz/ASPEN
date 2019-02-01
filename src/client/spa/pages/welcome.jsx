import {h} from 'preact'
import {Link} from 'preact-router'

/**
 * Welcome page
 * @return {VNode} Welcome page
 */
const Welcome = () => (
	<div>
		<header>
			<h1>What would you like to do?</h1>
		</header>
		<ul>
			<li><Link href="/create/ward">Add a new location</Link></li>
			<li><Link href="/create/patient">Admit a new patient</Link></li>
			<li><Link href="/wards">View all wards</Link></li>
			<li><Link href="/search/patient">Search for a patient</Link></li>
		</ul>
	</div>
)

export default Welcome
