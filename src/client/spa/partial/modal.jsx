import {h} from 'preact'

const Modal = () => (
	<div className="col s12">
		<div id="modal1" className="modal">
			<div className="modal-content">
				<h4>Modal</h4>
				<p>This popup should not appear with this content</p>
			</div>
			<div className="modal-footer">
				<a className="modal-close waves-effect waves-green btn-flat">Okay</a>
			</div>
		</div>
	</div>
)

export default Modal
