const authRouter = require('express').Router()
const path = require('path')
const axios = require('axios')
const Base64 = require('crypto-js/enc-base64')
const Utf8 = require('crypto-js/enc-utf8')


const login = path.join(process.cwd(), 'public', 'login.html')
const scopes = [
	'profile',
	'email',
	'openid',
]

authRouter.get('/auth/callback', async (req, res) => {
	// code? we must be authing
	if ('code' in req.query) {
		// {state, scope, session_state, prompt} are also available
		const {code} = req.query
		const resp = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: process.env.GOOGLE_OAUTH_CALLBACK,
		}, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).catch(console.log)
	} else {
		// no code? must be authed. issue JWT
		const {id_token, access_token, expires_in} = req.query
		const payloadB64 = id_token.split('.')
		const payload = Utf8.stringify(Base64.parse(payloadB64))
		const parsedPayload = JSON.parse(payload)
		console.log(parsedPayload)
		console.log(req.query)
	}
})


authRouter.use((req, res) => {
	const url = 'https://accounts.google.com/o/oauth2/v2/auth?'
		+ 'state=state_parameter_passthrough_value&'
		+ `redirect_uri=${encodeURIComponent(process.env.GOOGLE_OAUTH_CALLBACK)}&`
		+ 'response_type=code&'
		+ `client_id=${process.env.GOOGLE_CLIENT_ID}&`
		+ `scope=${encodeURIComponent('profile email openid')}`
	res.redirect(url)
})

// authRouter.get('/login', (_, res) => res.sendFile(login))

module.exports = authRouter
