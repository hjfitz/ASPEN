import {h, Component} from 'preact'

const getStyle = container => prop => parseInt(getComputedStyle(container, null)
	.getPropertyValue(prop)
	.replace('px', ''), 10)

class Signature extends Component {
	constructor() {
		super()
		this.pos = {x: 0, y: 0}
	}

	componentDidMount() {
		// set up event listeners
		document.addEventListener('mousemove', this.draw.bind(this))
		document.addEventListener('mousedown', this.setPosition.bind(this))
		document.addEventListener('mouseEnter', this.setPosition.bind(this))

		/**
		 * spoof mouse events using touch events to
		 * so that a phone user can make a signature
		 */
		this.canvas.addEventListener('touchstart', ev => this.setPosition(ev.touches[0]))
		this.canvas.addEventListener('touchend', () => document.dispatchEvent(new MouseEvent('mouseup', {})))
		this.canvas.addEventListener('touchmove', (e) => {
			e.preventDefault()
			const touch = e.touches[0]
			const mouseEvent = new MouseEvent('mousemove', {
				clientX: touch.clientX,
				clientY: touch.clientY,
				buttons: 1,
			})
			document.dispatchEvent(mouseEvent)
		})
	}

	setPosition(ev) {
		// no need to set state as component doesn't need to render again
		this.pos = {
			x: ev.clientX - this.canvas.getBoundingClientRect().left,
			y: ev.clientY - this.canvas.getBoundingClientRect().top,
		}
	}

	setCanvasDimensions() {
		if (!this.setWidth) {
			const getProp = getStyle(this.content)
			const padLeft = getProp('padding-left')
			const padRight = getProp('padding-right')
			const horzPad = padLeft + padRight

			const {width} = this.content.getBoundingClientRect()
			const {height} = this.canvas.getBoundingClientRect()
			this.canvas.height = height
			this.canvas.width = (width - horzPad)
			this.setWidth = true
		}
	}

	draw(ev) {
		const {ctx} = this
		// mouse left button must be pressed

		if (ev.buttons !== 1) return
		this.setCanvasDimensions()

		ctx.beginPath() // begin

		ctx.lineWidth = 5
		ctx.lineCap = 'round'
		ctx.strokeStyle = '#000'

		ctx.moveTo(this.pos.x, this.pos.y) // from
		this.setPosition(ev)
		ctx.lineTo(this.pos.x, this.pos.y) // to

		ctx.stroke() // draw it!
	}

	reset(ev) {
		ev.preventDefault()
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	render() {
		return (
			<div className="card z-depth-0">
				<div className="card-content" ref={c => this.content = c}>
					<span className="card-title">Sign below</span>
					<canvas
						ref={(c) => {
							this.canvas = c
							this.ctx = c.getContext('2d')
						}}
						id="sign-off-canvas"
						style={{width: '100%', border: '1px solid grey'}}
					/>
				</div>
				<div className="card-action">
					<a href="" className="teal-text text-lighten-1" onClick={this.reset.bind(this)}>Reset</a>
				</div>
			</div>
		)
	}
}

export default Signature
