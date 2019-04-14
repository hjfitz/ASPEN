import {h} from 'preact'
import {Link} from 'preact-router'

import '../../styles/breadcrumb.scss'


function getCurrentUrl(index, places) {
	let url = '/'
	for (let i = 0; i < (index + 1); i += 1) {
		url += `${places[i]}/`
	}
	return url
}

/**
 * Generate some breadcrumbs based on a location
 * Best used when updating with router
 * @param {object} props VNode props
 * @param {string} props.location Location to render for crumbs
 * @returns {VNode}
 */
const Breadcrumbs = (props) => {
	const places = props.location.split('/').filter(Boolean).filter(path => !!path.indexOf('?'))
	const crumbs = [
		<Link href="/" className="breadcrumb">Home</Link>,
		...places.map((loc, idx) => (
			<Link href={getCurrentUrl(idx, places)} className="breadcrumb">{loc}</Link>
		)),
	]

	if (!places.length) {
		return ''
	}

	return (
		<div className="navbar-fixed">
			<nav className="white z-depth-0">
				<div className="row">
					<div className="col s12">{crumbs}</div>
				</div>
			</nav>
		</div>
	)
}

export default Breadcrumbs
