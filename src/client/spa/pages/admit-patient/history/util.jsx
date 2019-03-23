import {h} from 'preact'

export const DecButton = props => (
	<div className="col">
		<a className="waves-effect waves-light btn red darken-1" onClick={props.onClick}><i className="material-icons left">arrow_downward</i>Remove</a>
	</div>
)

export const IncButton = props => (
	<div className="col">
		<a className="waves-effect waves-light btn blue darken-1" onClick={props.onClick}><i className="material-icons left">arrow_upward</i>Add</a>
	</div>
)
