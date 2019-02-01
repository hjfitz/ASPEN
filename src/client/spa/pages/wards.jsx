import {h, Component} from 'preact'
import {Link} from 'preact-router'
import {Loader} from '../Partial'
import {fhirBase} from '../../util'

class WardList extends Component {
	constructor(props) {
		super(props)
		this.state = {wardList: [], loaded: false}
	}

	async componentDidMount() {
		const {data: wardList} = await fhirBase.get('/Location?type=Ward')
		this.setState({wardList, loaded: true})
	}

	createWardList() {
		const mappedWards = this.state.wardList.map(ward => (
			// <li className="collection-item avatar">
			<Link href={`/ward/${ward.id}`} className="collection-item avatar">
				<img src="images/yuna.jpg" alt="" className="circle" />
				<span className="title">{ward.name}</span>
				<p>{ward.description}</p>
			</Link>
			// </li>
		))
		return <div className="collection">{mappedWards}</div>
	}

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
