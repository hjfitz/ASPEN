const {PasswordPolicy, charsets: {upperCase, lowerCase}} = require('password-sheriff')
const util = require('util')

const lengthPolicy = new PasswordPolicy({length: {minLength: 10}})
const identitcalCharsPolicy = new PasswordPolicy({identicalChars: {max: 4}})
const containsPolicy = new PasswordPolicy({containsAtLeast: {
	atLeast: 2,
	expressions: [upperCase, lowerCase],
}})

const lengthExplained = lengthPolicy.explain()
const lengthReason = util.format(lengthExplained[0].message, lengthExplained[0].format[0])

const identicalExplained = identitcalCharsPolicy.explain()
const identicalReason = util.format(identicalExplained[0].message, identicalExplained[0].format[0])

const containsExplained = containsPolicy.explain()
const containsReason = util.format(
	containsExplained[0].message,
	containsExplained[0].format[0],
	containsExplained[0].format[1],

)
function checkPass(password) {
	const correctLength = lengthPolicy.check(password)
	const noRepeated = identitcalCharsPolicy.check(password)
	const doesContain = containsPolicy.check(password)

	const outcome = {
		valid: (correctLength && noRepeated && doesContain),
		message: 'Password acceptable',
	}

	if (!noRepeated) outcome.message = identicalReason
	if (!doesContain) outcome.message = containsReason
	if (!correctLength) outcome.message = lengthReason

	return outcome
}

module.exports = checkPass
