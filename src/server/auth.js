const authRouter = require('express').Router()
const path = require('path')
const axios = require('axios')
const request = require('request-promise')
const queryString = require('querystring')
const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')
const csprng = require('csprng')
const jwt = require('jsonwebtoken')

const sessionSecret = csprng(128, 26)

const logger = require('./logger')

const signAsync = payload => new Promise((res, rej) => {
	jwt.sign(payload, sessionSecret,
		(err, token) => (err ? rej(err) : res(token)))
})

authRouter.get('/auth/callback', async (req, res) => {
	const meta = {file: 'auth.js', func: 'GET /auth/callback'}
	logger.info('recieved request from google', meta)
	// code? we must be authing
	if ('code' in req.query) {
		logger.debug('attempting to login', meta)
		// {state, scope, session_state, prompt} are also available
		const {code} = req.query
		const form = queryString.stringify({
			code,
			grant_type: 'authorization_code',
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: encodeURI(process.env.GOOGLE_OAUTH_CALLBACK),
		})
		const len = form.length
		const opts = {
			uri: 'https://www.googleapis.com/oauth2/v4/token',
			headers: {
				'Content-Length': len,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: form,
			method: 'POST',
		}
		const resp = await request(opts)
		const {access_token, expires_in, id_token} = JSON.parse(resp)
		const [, payloadB64] = id_token.split('.')
		const payload = Utf8.stringify(Base64.parse(payloadB64))
		const {email, name, hd, given_name, family_name} = JSON.parse(payload)
		// ? store user if not in database and add basic permissions + include in JWT
		const fypPayload = {
			email,
			name,
			hd,
			given_name,
			family_name,
			google_access_token: access_token,
			iat: new Date().getTime() / 1000,
			exp: expires_in,
		}
		const token = await signAsync(fypPayload)
		console.log(token)
		res.redirect(`/?token=${token}`)
	} else {
		logger.debug('code get', meta)
		// no code? must be authed. issue JWT
		const {id_token, access_token, expires_in} = req.query
		const payloadB64 = id_token.split('.')
		const payload = Utf8.stringify(Base64.parse(payloadB64))
		const parsedPayload = JSON.parse(payload)
		console.log(parsedPayload)
	}
})


authRouter.use((req, res, next) => {
	const {token} = req.headers
	if (token || (req.query && req.query.token)) return next()

	// if the user is not making a request with a token
	// or if we have not sent it to them, redirect to auth
	const url = 'https://accounts.google.com/o/oauth2/v2/auth?'
		+ 'state=state_parameter_passthrough_value&'
		+ 'include_granted_scopes=true&'
		+ 'access_type=offline&'
		+ `redirect_uri=${encodeURIComponent(process.env.GOOGLE_OAUTH_CALLBACK)}&`
		+ 'response_type=code&'
		+ `client_id=${process.env.GOOGLE_CLIENT_ID}&`
		+ `scope=${encodeURIComponent('profile email openid')}`
	return res.redirect(url)
})

module.exports = authRouter
