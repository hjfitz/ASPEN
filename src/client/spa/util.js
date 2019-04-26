import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import axios from 'axios'
import {Modal} from 'materialize-css'

/**
 * get and parse payload from localstorage
 * useful for checking exp and user information
 * @returns {object} JWT
 */
export function getJwtPayload(token) {
	if (!token) return false
	const [, payloadB64] = token.split('.')
	const payload = Utf8.stringify(Base64.parse(payloadB64))
	return JSON.parse(payload)
}

export const getName = () => getJwtPayload(localStorage.token).name

/**
 * no operation!
 */
export function noop() {}

/**
 * display a login modal
 */
export function showLogin() {
	localStorage.removeItem('token')
	const modal = document.querySelector('.modal.login-modal')
	const inst = Modal.getInstance(modal) || Modal.init(modal)
	inst.open()
}

/**
 * fhir layer for requests
 */
export const fhirBase = axios.create({
	baseURL: '/fhir',
	timeout: 1500,
	headers: {
		accept: 'application/fhir+json',
		'content-type': 'application/fhir+json',
	},
})

// apply a new token for every request as logging in natively will use old token
fhirBase.interceptors.request.use((config) => {
	if (localStorage.getItem('token')) {
		config.headers.token = localStorage.getItem('token')
	}
	return config
})

// intercept response error and ensure the status code isn't 401. see server/auth.js middleware
fhirBase.interceptors.response.use(resp => resp, (err) => {
	if (err.response.status === 401) return showLogin()
	return Promise.reject(err)
})


/**
 * Find the modal on the page, and pop it up!
 * @param {string} header Modal header
 * @param {string} body modal body
 */
export function doModal(header, body) {
	const modal = document.querySelector('.modal.information')
	const instance = Modal.getInstance(modal) || Modal.init(modal)
	const content = document.querySelector('.modal.information .modal-content')
	console.log(content)
	content.innerHTML = `
			<h4>${header}</h4>
			<p>${body}</p>`
	instance.open()
}

/**
 * capitalise a string: harry -> Harry
 * @param {string} str input to capitalise
 * @returns {string} capitalised string
 */
export const toTitle = str => str.charAt(0).toUpperCase() + str.slice(1)
