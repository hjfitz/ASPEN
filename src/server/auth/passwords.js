const {PasswordPolicy, charsets: {upperCase, lowerCase}} = require('password-sheriff')
const util = require('util')


/**
 * password policy:
 * * min length of 10 chars
 * * no more than 4 identical chars
 * * at least two upper/lower
 */
const lengthPolicy = new PasswordPolicy({length: {minLength: 10}})
const identitcalCharsPolicy = new PasswordPolicy({identicalChars: {max: 4}})
const containsPolicy = new PasswordPolicy({containsAtLeast: {
	atLeast: 2,
	expressions: [upperCase, lowerCase],
}})

// format reasons a password is not valid
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

/**
 * Ensures tht a password is:
 * * At least 10 characters long
 * * Has no more than 4 identical characters
 * * Has at least 2 upper and lower-case chars
 * @param {string} password Password to check
 */
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
