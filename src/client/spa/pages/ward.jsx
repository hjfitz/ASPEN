import {h, Component} from 'preact'
import Loader from '../partial/loader'
import {fhirBase} from '../../util'

class Ward extends Component {
	async componentDidMount() {
		console.log(this.props)
		const {ward_id} = this.props.matches
		const base = `Encounter/?class=admission&location_id=${ward_id}`
		const wardData = await fhirBase.get(base)
		console.log(wardData)
	}

	render() {
		return <Loader />
	}
}

export default Ward
