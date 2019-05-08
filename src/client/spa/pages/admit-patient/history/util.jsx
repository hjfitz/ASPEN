import {h} from 'preact'

/**
 * A decrease button, with a little down arrow
 * @param {preact.ComponentProps} props
 * @param {function} props.onClick onClick method
 */
export const DecButton = props => (
	<div className="col">
		<a className="waves-effect waves-light btn red darken-1" onClick={props.onClick}><i className="material-icons left">arrow_downward</i>Remove</a>
	</div>
)

/**
 * An in button, with a little up arrow
 * @param {preact.ComponentProps} props
 * @param {function} props.onClick onClick method
 */
export const IncButton = props => (
	<div className="col">
		<a className="waves-effect waves-light btn blue darken-1" onClick={props.onClick}><i className="material-icons left">arrow_upward</i>Add</a>
	</div>
)
