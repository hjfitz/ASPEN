import {Component} from 'preact'
import {route} from 'preact-router'

/**
 * Redirect the user elsewhere
 */
class Redirect extends Component {
	/**
	 * on mount, route elsewhere
	 */
	componentWillMount() {
		route(this.props.to, true)
	}

	/**
	 * @returns {null}
	 */
	render() {
		return null
	}
}

export default Redirect
