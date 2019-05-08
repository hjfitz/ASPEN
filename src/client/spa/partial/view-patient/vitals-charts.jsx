import {h, Component} from 'preact'
import format from 'date-fns/format'
import Chart from 'chart.js'

import WarningScore from '../../WarningScore'

import '../../styles/charts.scss'

const colours = [
	'rgb(46, 125, 50)', // green
	'rgb(38, 166, 154)', // teal
	'rgb(211, 47, 47)', // red
	'rgb(40, 53, 147)', // blue
	'rgb(194, 24, 91)', // pink
]

class NewsChart extends Component {
	constructor() {
		super()
		this.handleVitalsChart = this.handleVitalsChart.bind(this)
		this.handleNewsChart = this.handleNewsChart.bind(this)
	}

	/**
	 * on component mount, create charts
	 */
	componentDidMount() {
		this.handleVitalsChart()
		this.handleNewsChart()
	}

	/**
	 * given vital signs (from props)
	 * get all numeric values and place in to a dataset
	 * place these on a graph
	 */
	handleVitalsChart() {
		const {history} = this.props
		// take all observation dates and format them to 03:30pm, 26th Apr 2019
		const labels = history.map(obs => format(obs.date, 'hh:mma, Do MMM YYYY'))
		// take from [{resp: 11, temp: 12}, {resp: 11, temp: 13}]
		// change to {resp: [11, 11], temp: [12, 13]}
		const sets = history.reduce((acc, cur) => {
			Object.keys(cur).forEach((key) => {
				if (!(key in acc)) acc[key] = [cur[key]]
				else acc[key].push(cur[key])
			})
			return acc
		}, {})

		// can't graph these!
		delete sets.date
		delete sets.level_of_consciousness
		delete sets.supplemental_oxygen

		// map histoy in to datasets
		const datasets = Object.keys(sets).map((key, idx) => ({
			label: key,
			fill: false,
			backgroundColor: colours[idx].replace(')', ', 0.7)'), // 'rgba(255, 99, 132, 0.3)',
			borderColor: colours[idx],
			data: sets[key].map(val => parseInt(val, 10)),
		}))
		const ctx = this.vitalsChart.getContext('2d')
		this.vitalsChartInst = new Chart(ctx, {
			type: 'line',
			data: {labels, datasets},
			options: {

			},
		})
	}

	/**
	 * given vital signs (from props)
	 * get create a WarningScore object for each
	 * map this in to the calculated NEWS
	 * place these on a graph
	 */
	handleNewsChart() {
		const {history} = this.props
		const labels = history.map(obs => format(obs.date, 'hh:mma, Do MMM YYYY'))
		const scores = history.map(obs => new WarningScore(obs).score())
		const ctx = this.newsChart.getContext('2d')
		this.newsChartInst = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [{
					label: 'Warning Score',
					backgroundColor: 'rgb(255, 99, 132, 0.4)',
					borderColor: 'rgb(255, 99, 132)',
					data: scores,
				}],
			},
			options: {
				scales: {
					yAxes: [{ticks: {min: 0, max: 3}}],
				},
			},
		})
	}

	/**
	 *
	 * @param {preact.ComponentProps} props
	 * @returns {preact.VNode}
	 */
	render(props) {
		return (
			<div ref={n => props.refCb(n)} id="modal1" className="modal news-chart-modal">
				<div className="row">
					<div className="">
						<ul className="tabs chart-tabs" ref={t => this.tabs = t}>
							<li className="tab col s6"><a href="#vital-signs">Vital Signs</a></li>
							<li className="tab col s6"><a href="#news-tab">NEWS</a></li>
						</ul>
					</div>
					<div id="vital-signs" className="col s12">
						<canvas ref={c => this.vitalsChart = c} height="500" width="900" />
					</div>
					<div id="news-tab" className="col s12">
						<canvas ref={c => this.newsChart = c} height="500" width="900" />
					</div>
				</div>
			</div>
		)
	}
}


export default NewsChart
