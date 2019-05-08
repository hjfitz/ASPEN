require('@babel/register')
require('@babel/polyfill')
const {expect} = require('chai')
const WarningScore = require('../src/client/spa/WarningScore').default


const warningScore3 = new WarningScore({
	respiratory_rate: 6,
	oxygen_saturation: 90,
	heart_rate: 39,
	body_temperature: 34,
	systolic_bp: 90,
	level_of_consciousness: 'V',
	supplemental_oxygen: 'off',
})

const warningScore2 = new WarningScore({
	respiratory_rate: 22,
	oxygen_saturation: 92,
	heart_rate: 111,
	body_temperature: 40,
	systolic_bp: 92,
	level_of_consciousness: 'A',
	supplemental_oxygen: 'on',
})

const warningScore1 = new WarningScore({
	respiratory_rate: 10,
	oxygen_saturation: 94,
	heart_rate: 42,
	body_temperature: 36,
	systolic_bp: 105,
	level_of_consciousness: 'A',
	supplemental_oxygen: 'off',
})

const warningScore0 = new WarningScore({
	respiratory_rate: 15,
	oxygen_saturation: 96,
	heart_rate: 90,
	body_temperature: 37,
	systolic_bp: 200,
	level_of_consciousness: 'A',
	supplemental_oxygen: 'off',
})

describe('NEWS Calculation', () => {
	describe('Respiratory rate', () => {
		it('should return 3 with a respiratory rate of 6', () => {
			const score = warningScore3.scoreResp()
			expect(score).to.equal(3)
		})

		it('should return 2 with a respiratory rate of 22', () => {
			const score = warningScore2.scoreResp()
			expect(score).to.equal(2)
		})

		it('should return 1 with a respiratory rate of 10', () => {
			const score = warningScore1.scoreResp()
			expect(score).to.equal(1)
		})

		it('should return 0 with a respiratory rate of 15', () => {
			const score = warningScore0.scoreResp()
			expect(score).to.equal(0)
		})
	})

	describe('Oxygen saturation', () => {
		it('should return 3 with a saturation of 90', () => {
			const score = warningScore3.scoreOxy()
			expect(score).to.equal(3)
		})

		it('should return 2 with a saturation of 92', () => {
			const score = warningScore2.scoreOxy()
			expect(score).to.equal(2)
		})

		it('should return 1 with a saturation of 94', () => {
			const score = warningScore1.scoreOxy()
			expect(score).to.equal(1)
		})

		it('should return 0 with a saturation of 96', () => {
			const score = warningScore0.scoreOxy()
			expect(score).to.equal(0)
		})
	})

	describe('Heart rate', () => {
		it('should return 3 with a heart rate of 39', () => {
			const score = warningScore3.scoreHeart()
			expect(score).to.equal(3)
		})

		it('should return 2 with a heart rate of 111', () => {
			const score = warningScore2.scoreHeart()
			expect(score).to.equal(2)
		})

		it('should return 1 with a heart rate of 42', () => {
			const score = warningScore1.scoreHeart()
			expect(score).to.equal(1)
		})

		it('should return 0 with a heart rate of 90', () => {
			const score = warningScore0.scoreHeart()
			expect(score).to.equal(0)
		})
	})

	describe('Body Temperature', () => {
		it('should return 3 with a temperature of 34', () => {
			const score = warningScore3.scoreTemp()
			expect(score).to.equal(3)
		})

		it('should return 2 with a temperature of 40', () => {
			const score = warningScore2.scoreTemp()
			expect(score).to.equal(2)
		})

		it('should return 1 with a temperature of 36', () => {
			const score = warningScore1.scoreTemp()
			expect(score).to.equal(1)
		})

		it('should return 0 with a temperature of 37', () => {
			const score = warningScore0.scoreTemp()
			expect(score).to.equal(0)
		})
	})

	describe('blood pressure', () => {
		it('should return 3 with a blood pressure of 90', () => {
			const score = warningScore3.scoreBP()
			expect(score).to.equal(3)
		})

		it('should return 2 with a blood pressure of 92', () => {
			const score = warningScore2.scoreBP()
			expect(score).to.equal(2)
		})

		it('should return 1 with a blood pressure of 105', () => {
			const score = warningScore1.scoreBP()
			expect(score).to.equal(1)
		})

		it('should return 0 with a blood pressure of 200', () => {
			const score = warningScore0.scoreBP()
			expect(score).to.equal(0)
		})
	})

	describe('Level of consciousness', () => {
		it('should return 3 with a any unconscious level', () => {
			const score = warningScore3.scoreCons()
			expect(score).to.equal(3)
		})

		it('should return 0 when the patient is aware', () => {
			const score = warningScore0.scoreCons()
			expect(score).to.equal(0)
		})
	})

	describe('supplemental oxygen', () => {
		it('should return 2 with supplemental oxygen', () => {
			const score = warningScore2.scoreSuppOxy()
			expect(score).to.equal(2)
		})

		it('should return 0 when the patient is not on supplemental oxygen', () => {
			const score = warningScore0.scoreSuppOxy()
			expect(score).to.equal(0)
		})
	})
	describe('overall ews', () => {
		it('should return 0 if all scores are 0', () => {
			const overallScore = warningScore0.score()
			expect(overallScore).to.equal(0)
		})

		it('should return 1 if one score is 1', () => {
			const overallScore = warningScore1.score()
			expect(overallScore).to.equal(1)
		})

		it('should return 2 if one score is 2', () => {
			const overallScore = warningScore2.score()
			expect(overallScore).to.equal(2)
		})

		it('should return 3 if one score is 3', () => {
			const overallScore = warningScore3.score()
			expect(overallScore).to.equal(3)
		})
	})
})
