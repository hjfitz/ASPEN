import {h} from 'preact'

/**
 * Materialize select element
 * @param {object} props Element properties
 * @param {Array<object>} props.options Array of objects in form {val, text}
 * @param {string} props.default default option
 * @param {string} props.label input label
 * @returns {VNode} Preact element
 */
const Select = props => (
	<div className="input-field col s12 m6">
		<select id={props.id || ''}>
			<option value="" disabled selected>{props.default}</option>
			{props.options.map(opt => <option value={opt.val}>{opt.text}</option>)}
		</select>
		<label>{props.label}</label>
	</div>
)

export default Select
