class NEWSError extends Error {
	/**
	 * Error wrapper for NEWS object
	 * @param {string} message Error message
	 * @param {string[]} missing missing vital signs
	 */
	constructor(message, missing) {
		super(message)
		this.name = 'NEWSError'
		this.missing = missing
	}
}

/**
 * ! TODO thorough testing
 */
export default class WarningScore {
	/**
	 * Warning score wrapper for patient info
	 * @param {object} report formatted diagnostic report
	 * @param {number} report.respiratory_rate
	 * @param {number} report.oxygen_saturation
	 * @param {number} report.heart_rate
	 * @param {number} report.body_temperature
	 * @param {number} report.systolic_bp
	 * @param {string} report.level_of_consciousness
	 * @param {string} report.supplemental_oxygen (on/off)
	 */
	constructor(report = {}) {
		// can't generate a proper EWS without these
		this.requiredFields = [
			'respiratory_rate',
			'oxygen_saturation',
			'heart_rate',
			'body_temperature',
			'systolic_bp',
			'level_of_consciousness',
		]
		this.respRate = report.respiratory_rate
		this.oxySat = report.oxygen_saturation
		this.heartRate = report.heart_rate
		this.bodyTemp = report.body_temperature
		this.systolicBP = report.systolic_bp
		this.conscLevel = report.level_of_consciousness
		this.suppOxygen = report.supplemental_oxygen
		this.missingFields = this.requiredFields.filter(field => !(field in report))
		if (this.missingFields.length) {
			throw new Error(
				`Error creating object - missing fields: ${this.missingFields.join(', ')}`,
				this.missingFields,
			)
		}
	}

	/**
	 * returns object with invididually scored elements (for use in chart)
	 * @return {object} each part of a patient warning score individually scored
	 */
	calculate() {
		return {
			resp: this.scoreResp(),
			oxySat: this.scoreOxy(),
			heartRate: this.scoreHeart(),
			bodyTemp: this.scoreTemp(),
			systolicBP: this.scoreBP(),
			conscLevel: this.scoreCons(),
			suppOxygen: this.scoreSuppOxy(),
		}
	}

	/**
	 * returns the NEWS for the given set of vital signs
	 * @returns {number} patient NEWS
	 */
	score() {
		const vals = Object.values(this.calculate())
		return Math.ceil(
			vals.reduce((acc, cur) => acc + cur) / vals.length,
		)
	}

	/**
	 * Create an EWS for respiratory rate
	 * @returns {number}
	 */
	scoreResp() {
		const rate = parseFloat(this.respRate, 10)
		if (rate >= 12 && rate <= 20) return 0
		if (rate >= 9 && rate <= 11) return 1
		if (rate >= 21 && rate <= 24) return 2
		if (rate <= 8 || rate >= 25) return 3
		throw new NEWSError(`Unable to calculate NEWS: respiratory rate incorrect (${rate})`)
	}

	/**
	 * Create EWS for patient oxygen saturation
	 * @returns {number}
	 */
	scoreOxy() {
		const sat = parseFloat(this.oxySat, 10)
		if (sat >= 96) return 0
		if (sat >= 94) return 1
		if (sat >= 92) return 2
		if (sat <= 91) return 3
		throw new NEWSError(`Unable to calculate NEWS: oxygen saturation incorrect (${sat})`)
	}

	/**
	 * Create EWS for patient heart rate
	 * @returns {number}
	 */
	scoreHeart() {
		const rate = parseFloat(this.heartRate, 10)
		if (rate <= 40 || rate >= 131) return 3
		if (rate >= 111 && rate <= 130) return 2
		if ((rate >= 41 && rate <= 50) || (rate >= 91 && rate <= 110)) return 1
		if (rate >= 51 && rate <= 90) return 0
		throw new NEWSError(`Unable to calculate NEWS: heart rate incorrect (${rate})`)
	}

	/**
	 * Create EWS for patient body temperature
	 * @returns {number}
	 */
	scoreTemp() {
		const temp = parseFloat(this.bodyTemp, 10)
		if (temp <= 35) return 3
		if (temp >= 39.1) return 2
		if ((temp >= 35.1 && temp <= 36) || (temp >= 38.1 && temp <= 39)) return 1
		if (temp >= 36.1 && temp <= 38) return 0
		throw new NEWSError(`Unable to calculate NEWS: body temperature incorrect (${temp})`)
	}

	/**
	 * Create EWS for patient blood pressure
	 * @returns {number}
	 */
	scoreBP() {
		const bp = parseFloat(this.systolicBP, 10)
		if (bp <= 90 || bp >= 220) return 3
		if (bp >= 91 && bp <= 100) return 2
		if (bp >= 101 && bp <= 110) return 1
		if (bp >= 111 && bp <= 219) return 0
		throw new NEWSError(`Unable to calculate NEWS: BP incorrect (${bp})`)
	}

	/**
	 * Create EWS for patient consciousness level
	 * @returns {number}
	 */
	scoreCons() {
		if (this.conscLevel === 'A') return 0
		return 3
	}

	/**
	 * Create EWS for patient on supplemental oxygen
	 * @returns {number}
	 */
	scoreSuppOxy() {
		if (this.suppOxygen === 'on') return 2
		return 0
	}
}
