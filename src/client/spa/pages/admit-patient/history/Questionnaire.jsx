/* eslint-disable react/no-unused-state */
import {Component} from 'preact'

class Questionnaire extends Component {
	/**
	 *
	 * @param {preact.ComponentProps} props
	 */
	constructor(props) {
		super(props)
		this.state = {showQuestionnaire: false}
	}

	/**
	 * Used to toggle a questionnaire
	 * @param {Boolean} showQuestionnaire whether to show the questionnaise
	 */
	toggleQuestionnaire(showQuestionnaire = false) {
		return () => this.setState({showQuestionnaire})
	}
}

export default Questionnaire
