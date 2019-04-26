const authRouter = require('express').Router()
const request = require('request-promise')
const queryString = require('querystring')
const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const checkPass = require('./passwords')
const logger = require('../logger')
const OperationOutcome = require('../fhir/classes/OperationOutcome')
const {knex} = require('../db')

// ! csprng is ideal - but not good for using nodemon in development. fix this later
const sessionSecret = process.env.AUTH_SECRET// = csprng(128, 26)
const saltRounds = 5 // has a big impact on perf

const lectureLength = 50 * 60

const createPayload = (userid, name, permissions = []) => ({
	permissions,
	name,
	userid,
	exp: Math.floor(Date.now() / 1000) + lectureLength,
})

/**
 * Given user details, store them in the database, if they don't already exist
 * This is so that admins can assign wards
 * @param {string} payload unparsed json
 */
async function handleUser(payload) {
	const meta = {file: 'auth.js', func: 'handleUser()'}
	const parsed = JSON.parse(payload)
	const rows = await knex('practitioner')
		.select()
		.where({username: parsed.email})
	if (rows.length) {
		logger.debug('user exists. returning', meta)
		return rows[0]
	}
	logger.debug('creating new user', meta)
	const [resp] = await knex('practitioner').insert({
		name: parsed.name,
		added: new Date(),
		username: parsed.email,
		account_type: 'google',
		permissions: '[]',
	}).returning('*')
	logger.info(`user created with id: ${resp.practitioner_id}`, meta)
	return resp
}

/**
 * Google oauth flow. Environment variables required:
 *** GOOGLE_CLIENT_ID - Client ID from Google
 *** GOOGLE_CLIENT_SECRET - Client secret from Google
 *** GOOGLE_OAUTH_CALLBACK - The FULL URL for google to callback to. This set in app settings
 *** AUTH_SECRET - some password for the JWT
 * Implementation from https://developers.google.com/identity/protocols/OAuth2WebServer
 */
authRouter.get('/auth/callback', async (req, res) => {
	const meta = {file: 'auth.js', func: 'GET /auth/callback'}
	logger.info('recieved request from google', meta)
	// code? we must be authing
	logger.debug('attempting to login', meta)

	// Create request body
	const body = queryString.stringify({
		code: req.query.code,
		grant_type: 'authorization_code',
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: encodeURI(process.env.GOOGLE_OAUTH_CALLBACK),
	})
	const opts = {
		body,
		method: 'POST',
		uri: 'https://www.googleapis.com/oauth2/v4/token',
		headers: {
			'Content-Length': body.length,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}
	// send body to google and wait for AT/ID Token
	const resp = await request(opts)
	// can access google ACCESS_TOKEN here
	const {id_token} = JSON.parse(resp)

	// ID Token is a JWT, extract this and use it in our new JWT
	// create our own JWT because we know the pass and can verify it
	const [, payloadB64] = id_token.split('.')
	const payload = Utf8.stringify(Base64.parse(payloadB64))
	const {email, name, hd, given_name, family_name} = JSON.parse(payload)

	const {practitioner_id, permissions} = await handleUser(payload)
	// ? store user if not in database and add basic permissions + include in JWT

	const tokenPayload = {
		...createPayload(practitioner_id, name, permissions),
		email,
		hd,
		given_name,
		family_name,
	}

	const token = jwt.sign(tokenPayload, sessionSecret)

	// return the user to the homepage
	// sadly state in google's oauth response is not the previous url as it is with other servers
	res.redirect(`/?token=${token}`)

	// user has authed: handle their identity
})

// user gets redirected to /login: create a URL and redirect them to google's oauth server
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
	res.redirect(url)
	// return res.redirect(`/login.html?google_redir=${url}`)
})

authRouter.get('/login/url', (req, res) => {
	const url = 'https://accounts.google.com/o/oauth2/v2/auth?'
		+ 'state=state_parameter_passthrough_value&'
		+ 'include_granted_scopes=true&'
		+ 'access_type=offline&'
		+ `redirect_uri=${encodeURIComponent(process.env.GOOGLE_OAUTH_CALLBACK)}&`
		+ 'response_type=code&'
		+ `client_id=${process.env.GOOGLE_CLIENT_ID}&`
		+ `scope=${encodeURIComponent('profile email openid')}`
	res.send(url)
})

// recieve login data from user
authRouter.post('/login', async (req, res) => {
	const {username, password} = req.body
	try {
		const [row] = await knex('practitioner').select().where({username, account_type: 'normal'})
		if (!row) return res.status(400).send('Unable to login: username does not exist!')

		// compare the password with the hash stored in db. no match? reject
		const passMatch = await bcrypt.compare(password, row.passhash)
		if (!passMatch) return res.status(400).send('Passwords do not match')

		const {practitioner_id, name, permissions} = row

		const tokenPayload = {
			...createPayload(practitioner_id, name, permissions),
			username,
		}
		const token = jwt.sign(tokenPayload, sessionSecret)

		// message is shown in popup
		return res.json({token, message: `Welcome back, ${row.name}`})
	} catch (err) {
		// handle errors with a 500 so the server does not die
		return res.status(500).send(`Error logging in: ${err}`)
	}
})

authRouter.post('/login/create', async (req, res) => {
	// to create a user, name, username and password is required
	const required = ['name', 'username', 'password']
	// pull from request body
	const {name, username, password} = req.body

	// check we have all required entries
	const missing = required.filter(key => !req.body[key])
	if (missing.length) return res.status(400).send(`Couldn't register! Missing: ${missing.join(', ')}`)

	// check they don't already exist
	const rows = await knex('practitioner').select().where({username})
	if (rows.length) return res.status(400).send("Couldn't register! Username already exists")

	// check that password > 10 chars and includes alphanum]
	const {valid, message} = checkPass(password)
	if (!valid) return res.status(400).send(`Issue with password: ${message}`)

	try {
		// calculate a password hash and put in db
		const passhash = await bcrypt.hash(password, saltRounds)
		await knex('practitioner').insert({
			name,
			username,
			passhash,
			permissions: '[]', // knex with JSON rows still means that json must be stringified
			account_type: 'normal',
			added: new Date(),
		})
		return res.status(200).send(`Successfully registered. Welcome, ${name}`)
	} catch (err) {
		return res.status(500).send(`<p>Couldn't register! Error:</p><p>${err}</p>`)
	}
})

// token checking middleware for fhir API
authRouter.use('/fhir', (req, res, next) => {
	const meta = {file: 'auth.js', func: 'auth middleware'}
	// extract token from headers
	const {token} = req.headers
	logger.debug(`has token: ${!!token}`, meta)
	logger.silly(`token: ${token}`, meta)
	// no token? login
	if (!token) return res.redirect('/login')
	try {
		// verify token with session secret
		const valid = jwt.verify(token, sessionSecret)
		logger.silly(`validated user token. allowing them through, ${JSON.stringify(valid)}`, meta)
		return next()
	} catch (err) {
		// error verifying token? redirect to login
		logger.debug('user not valid. informing client axios', meta)
		logger.error(`error caught: ${err}`, meta)
		const outcome = new OperationOutcome('error', 401, req.originalUrl, 'JWT invalid or inaccessible', err)
		return outcome.makeResponse(res)
	}
})


module.exports = authRouter
