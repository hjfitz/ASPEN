import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import axios from 'axios'
import {Modal} from 'materialize-css'

/**
 * get and parse payload from localstorage
 * useful for checking exp and user information
 * @returns {object} JWT
 */
export function getJwtPayload() {
	const token = localStorage.getItem('token')
	if (!token) return false
	const payloadB64 = token.split('.')
	const payload = Utf8.stringify(Base64.parse(payloadB64))
	return JSON.parse(payload)
}

export function noop() {}

export const fhirBase = axios.create({
	baseURL: '/fhir',
	timeout: 1500,
	headers: {
		accept: 'application/fhir+json',
		'content-type': 'application/fhir+json',
	},
})

export function doModal(header, body) {
	const modal = document.querySelector('.modal')
	const instance = Modal.getInstance(modal) || Modal.init(modal)
	const content = document.querySelector('.modal-content')
	content.innerHTML = `
			<h4>${header}</h4>
			<p>${body}</p>`
	instance.open()
}

// shitty enums
export const MINUTE = 1000 * 60
export const HALF_HOUR = MINUTE * 30
export const HOUR = MINUTE * 60
