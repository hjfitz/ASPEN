import {h, Component} from 'preact'

/**
 * given a container, return a function that checks returns a function to get a property value
 * @param {HTMLElemement} container Containter to get a style and parse int to
 */
const getStyle = container => prop => parseInt(getComputedStyle(container, null)
	.getPropertyValue(prop)
	.replace('px', ''), 10)

/**
 * Given a touch event, get the X and Y, and simulate a mousemove event
 * Simulate button 1: this is the click button
 * @param {Event} e event to simulate as a mouseclick
 */
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

/**
 * simulate mouseup on touchstop
 * @returns {Boolean}
 */
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

	/**
	 * on mount, add event listeners for mousemove
	 * add event listeners for touch events that simulate mousemove events
	 */
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

	/**
	 * on unmount, remove all event listeners
	 */
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

	/**
	 * Given an event, take the mouse coords and update the mouse position in this component
	 * @param {Event} ev
	 */
	setPosition(ev) {
		// no need to set state as component doesn't need to render again
		this.pos = {
			x: ev.clientX - this.canvas.getBoundingClientRect().left,
			y: ev.clientY - this.canvas.getBoundingClientRect().top,
		}
	}

	/**
	 * resize the canvas to fill available space on every draw()
	 */
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

	/**
	 * on a mousemove event, move a virtual pointer on a canvas
	 * update this position with the event
	 * move the virtual pointer to the new place
	 * stroke a line between the beginning and end
	 * @param {Event} ev mousemove event
	 */
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

	/**
	 * clear the signature on the canvas
	 * @param {Event} ev Click event
	 */
	reset(ev) {
		ev.preventDefault()
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	/**
	 * @returns {preact.VNode}
	 */
	render() {
		return (
			<div className="card z-depth-0">
				<div className="card-content" ref={c => this.content = c}>
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
