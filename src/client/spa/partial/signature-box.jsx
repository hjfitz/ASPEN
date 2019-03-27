import {h, Component} from 'preact'

function emulateTouch(e) {
	e.preventDefault()
	const touch = e.touches[0]
	const mouseEvent = new MouseEvent('mousemove', {
		clientX: touch.clientX,
		clientY: touch.clientY,
		buttons: 1,
	})
	document.dispatchEvent(mouseEvent)
}

function dispatchMouseUp() {
	return document.dispatchEvent(new MouseEvent('mouseup', {}))
}


class Signature extends Component {
	constructor() {
		super()
		this.pos = {x: 0, y: 0}
		this.draw = this.draw.bind(this)
		this.setPosition = this.setPosition.bind(this)
		this.setTouchPosition = this.setTouchPosition.bind(this)
	}

	componentDidMount() {
		// set up event listeners
		document.addEventListener('mousemove', this.draw)
		document.addEventListener('mousedown', this.setPosition)
		document.addEventListener('mouseEnter', this.setPosition)

		/**
		 * spoof mouse events using touch events to
		 * so that a phone user can make a signature
		 */
		this.canvas.addEventListener('touchstart', this.setTouchPosition)
		this.canvas.addEventListener('touchend', dispatchMouseUp)
		this.canvas.addEventListener('touchmove', emulateTouch)
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.draw)
		document.removeEventListener('mousedown', this.setPosition)
		document.removeEventListener('mouseEnter', this.setPosition)

		/**
		 * spoof mouse events using touch events to
		 * so that a phone user can make a signature
		 */
		this.canvas.removeEventListener('touchstart', this.setTouchPosition)
		this.canvas.removeEventListener('touchend', dispatchMouseUp)
		this.canvas.removeEventListener('touchmove', emulateTouch)
	}

	setTouchPosition(ev) {
		return this.setPosition(ev.touches[0])
	}

	setPosition(ev) {
		// no need to set state as component doesn't need to render again
		this.pos = {
			x: ev.clientX - this.canvas.getBoundingClientRect().left,
			y: ev.clientY - this.canvas.getBoundingClientRect().top,
		}
	}

	draw(ev) {
		const {ctx} = this
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

	reset(ev) {
		ev.preventDefault()
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	render() {
		return (
			<div className="card">
				<div className="card-content">
					<span className="card-title">Sign below</span>
					<canvas
						ref={(c) => {
							try {
								this.canvas = c
								this.ctx = c.getContext('2d')
							} catch (e) {}
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
