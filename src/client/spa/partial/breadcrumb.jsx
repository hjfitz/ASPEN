import {h} from 'preact'
import {Link} from 'preact-router'

import '../styles/breadcrumb.scss'


/**
 * Generate some breadcrumbs based on a location
 * Best used when updating with router
 * @param {object} props VNode props
 * @param {string} props.location Location to render for crumbs
 * @returns {VNode}
 */
const Breadcrumbs = (props) => {
	const places = props.location.split('/').filter(Boolean)
	const crumbs = [
		<Link href="/" className="breadcrumb">Home</Link>,
		...places.map(loc => <Link href={`/${loc}`} className="breadcrumb">{loc}</Link>),
	]

	return (
		<nav className="white z-depth-0">
			<div className="row">
				<div className="col s12">{places.length ? crumbs : []}</div>
			</div>
		</nav>
	)
}

export default Breadcrumbs
