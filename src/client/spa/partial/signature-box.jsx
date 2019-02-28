import {h, Component} from 'preact'

class Signature extends Component {
	constructor() {
		super()
		this.pos = {x: 0, y: 0}
	}

	componentDidMount() {
		console.log(this.canvas)
		// set up event listeners
		document.addEventListener('mousemove', this.draw.bind(this))
		document.addEventListener('mousedown', this.setPosition.bind(this))
		document.addEventListener('mouseEnter', this.setPosition.bind(this))
		document.addEventListener('touchmove', this.draw.bind(this))
		document.addEventListener('touchstart', this.setPosition.bind(this))
		// document.addEventListener('touchEnter', this.setPosition.bind(this))
	}

	setPosition(ev) {
		ev.preventDefault()
		console.log(ev)
		this.pos = {
			x: ev.clientX - this.canvas.getBoundingClientRect().left,
			y: ev.clientY - this.canvas.getBoundingClientRect().top,
		}
	}

	draw(ev) {
		const ctx = this.canvas.getContext('2d')
		console.log(this.pos)
		// mouse left button must be pressed
		if (ev.buttons !== 1) return

		ctx.beginPath() // begin

		ctx.lineWidth = 5
		ctx.lineCap = 'round'
		ctx.strokeStyle = '#000'

		ctx.moveTo(this.pos.x, this.pos.y) // from
		this.setPosition(ev)
		ctx.lineTo(this.pos.x, this.pos.y) // to

		ctx.stroke() // draw it!
	}

	reset() {
		const ctx = this.canvas.getContext('2d')
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}


	render() {
		return (
			<div className="card">
				<div className="card-content">
					<span className="card-title">Sign below</span>
					<canvas ref={c => this.canvas = c} style={{width: '100%', border: '1px solid grey'}} />
				</div>
				<div className="card-action">
					<a href="" className="teal-text text-lighten-1" onClick={this.reset.bind(this)}>Reset</a>
				</div>
			</div>
		)
	}
}

export default Signature
