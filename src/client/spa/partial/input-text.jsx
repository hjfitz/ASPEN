import {h} from 'preact'
import {noop} from '../../util'

/**
 * Materialize input element
 * @param {object} props element properties
 * @param {string} props.id id of element
 * @param {string} props.label label for input
 * @param {function} props.onKeyUp onKeyUp event listener
 * @param {string} props.className css class for the wrapper
 * @returns {VNode} input element
 */
const Input = props => (
	<div className={`input-field col ${props.className || 's6'}`}>
		<input onKeyUp={props.onKeyUp || noop} id={props.id} type={props.type || 'text'} className="validate" />
		<label htmlFor={props.id}>{props.label}</label>
	</div>
)

export default Input
