const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')

/**
 * Pull and parse a JWT payload
 * @param {string} token JWT
 */
function decodeJWTPayload(token) {
	if (!token) return {permissions: []}
	const [, payload] = token.split('.')
	const utfPayload = Base64.parse(payload).toString(Utf8)
	return JSON.parse(utfPayload)
}

module.exports = {
	decodeJWTPayload,
}
