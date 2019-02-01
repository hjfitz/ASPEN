import {h, Component} from 'preact'
import {Input} from '../Partial'
import {fhirBase} from '../../util'

class SearchPatient extends Component {
	componentDidMount() {
		console.log('mounted')
		const input = document.getElementById('search')
		// input.addEventListener('keyup', () => console.log(input.value))
	}

	search() {
		const content = document.getElementById('search').value
		console.log(content)
	}

	render() {
		return (
			<div className="row">
				<header className="col s12">
					<h1>Search</h1>
				</header>
				<Input className="s12" id="search" label="Search" onKeyUp={this.search.bind(this)} />

			</div>
		)
	}
}

export default SearchPatient
