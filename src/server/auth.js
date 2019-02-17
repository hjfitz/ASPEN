const authRouter = require('express').Router()
const request = require('request-promise')
const queryString = require('querystring')
const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')
const jwt = require('jsonwebtoken')
const logger = require('./logger')
const OperationOutcome = require('./fhir/classes/OperationOutcome')

const sessionSecret = process.env.AUTH_SECRET// = csprng(128, 26)


authRouter.get('/auth/callback', async (req, res) => {
	const meta = {file: 'auth.js', func: 'GET /auth/callback'}
	logger.info('recieved request from google', meta)
	// code? we must be authing
	logger.debug('attempting to login', meta)
	// {state, scope, session_state, prompt} are also available
	const body = queryString.stringify({
		code: req.query.code,
		grant_type: 'authorization_code',
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: encodeURI(process.env.GOOGLE_OAUTH_CALLBACK),
	})
	const len = body.length
	const opts = {
		uri: 'https://www.googleapis.com/oauth2/v4/token',
		headers: {
			'Content-Length': len,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
		method: 'POST',
	}
	const resp = await request(opts)
	const {access_token, id_token} = JSON.parse(resp)
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
		exp: Math.floor(Date.now() / 1000) + (60 * 60),
	}
	const token = jwt.sign(fypPayload, sessionSecret)
	res.redirect(`/?token=${token}`)
})


authRouter.get('/login', (_, res) => {
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

// token checking middleware for fhir API
authRouter.use('/fhir', (req, res, next) => {
	const meta = {file: 'auth.js', func: 'auth middleware'}
	const {token} = req.headers
	logger.debug(`has token: ${!!token}`, meta)
	if (!token) return res.redirect('/login')
	try {
		const valid = jwt.verify(token, sessionSecret)
		logger.debug(`validated user token. allowing them through, ${JSON.stringify(valid)}`, meta)
		return next()
	} catch (err) {
		logger.debug('user not valid. informing client axios', meta)
		const outcome = new OperationOutcome('error', 401, req.originalUrl, 'JWT invalid or inaccessible', err)
		return outcome.makeResponse(res)
	}
})


module.exports = authRouter
