const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')

function decodeJWTPayload(token) {
	const [, payload] = token.split('.')
	const utfPayload = Base64.parse(payload).toString(Utf8)
	return JSON.parse(utfPayload)
}

module.exports = {
	decodeJWTPayload,
}
