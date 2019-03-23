/* eslint-disable react/no-unused-state */
import {Component} from 'preact'

class Questionnaire extends Component {
	constructor(props) {
		super(props)
		this.state = {showQuestionnaire: false}
	}

	toggleQuestionnaire(showQuestionnaire = false) {
		return () => this.setState({showQuestionnaire})
	}
}

export default Questionnaire
