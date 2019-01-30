import {h} from 'preact'

/**
 * Materialize input element
 * @param {object} props element properties
 * @param {string} props.id id of element
 * @param {string} props.label label for input
 * @returns {VNode} input element
 */
const Input = props => (
	<div className="input-field col s6">
		<input id={props.id} type="text" className="validate" />
		<label htmlFor={props.id}>{props.label}</label>
	</div>
)

export default Input