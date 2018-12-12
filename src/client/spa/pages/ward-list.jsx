import {h, Component} from 'preact'

const generateWards = wards => wards.map(ward => (
	<a href={`/ward/${encodeURIComponent(ward)}`}>{ward}</a>
))

class WardList extends Component {
	constructor(props) {
		super(props)
		this.state = {wards: ['FYP-Test']}
	}

	componentDidMount() {
		console.log('[WARDLIST] mounted')
	}


	render() {
		const wards = generateWards(this.state.wards)
		return (
			<div className="wards">
				<h1>Some wards</h1>
				{wards}
			</div>
		)
	}
}

export default WardList
