import {h, Component} from 'preact'
import {Link} from 'preact-router'
import {Loader} from '../Partial'
import {fhirBase} from '../util'

class WardList extends Component {
	/**
	 * Ward listing component
	 * @param {preact.props} props component properties
	 */
	constructor(props) {
		super(props)
		this.state = {wardList: [], loaded: false}
	}

	/**
	 * on mount, get all wards and update state so createWardList renders something
	 */
	async componentDidMount() {
		const {data: wardList} = await fhirBase.get('/Location?type=Ward')
		this.setState({wardList, loaded: true})
	}

	/**
	 * take this.state.wardList (updated from FHIR API in componentDidMount())
	 * render a ward list based off of this
	 * DOM tree should be: a > img+span+p
	 * @returns {preact.VNode}
	 */
	createWardList() {
		const mappedWards = this.state.wardList.map(ward => (
			<Link href={`/wards/${ward.id}`} className="collection-item avatar">
				<img src="img/ward.png" alt="Ward" className="circle" />
				<span className="title">{ward.name}</span>
				<p>{ward.description}</p>
			</Link>
		))
		return <div className="collection">{mappedWards}</div>
	}

	/**
	 * render the ward listing
	 * @returns {preact.VNode}
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		return (
			<div className="row">
				<header>
					<h1>Wards</h1>
				</header>
				{this.createWardList()}
			</div>
		)
	}
}

export default WardList
