import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

/**
 * get and parse payload from localstorage
 * useful for checking exp and user information
 * @returns {object} JWT
 */
export function getJwtPayload() {
	const token = localStorage.getItem('token')
	if (!token) {
		return false
	}
	const payloadB64 = token.split('.')
	const payload = Utf8.stringify(Base64.parse(payloadB64))
	return JSON.parse(payload)
}

export const MINUTE = 1000 * 60
export const HALF_HOUR = MINUTE * 30
export const HOUR = MINUTE * 60
