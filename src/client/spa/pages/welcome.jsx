import {h} from 'preact'
import {Link} from 'preact-router'

const Welcome = () => (
	<div>
		<header>
			<h1>What would you like to do?</h1>
		</header>
		<ul>
			<li><Link href="/create/ward">Create a ward</Link></li>
			<li><Link href="/create/patient">Add a new patient</Link></li>
			<li><Link href="/wards">View all possible wards</Link></li>
		</ul>
	</div>
)

export default Welcome
