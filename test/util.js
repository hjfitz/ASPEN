const axios = require('axios')
const fs = require('fs')
const path = require('path')

//  where secret = "Cross-Origin%20Read%20Blocking%20(CORB)%20blocked%20cross-origin%20response"
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwidXNlcmlkIjo1LCJwZXJtaXNzaW9ucyI6WyJ2aWV3OmFsbHBhdGllbnRzIiwiZWRpdDpwZXJtaXNzaW9ucyIsInZpZXc6YWxsIl0sImlhdCI6MTU1NTYyNTMyMn0.vwglJTOquQzqpX7Jhcoe0-DdctME7Gvxwjf2u75Id2E'
const noPermsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVwNzgwNDYxQG15cG9ydC5hYy51ayIsInVzZXJpZCI6NCwicGVybWlzc2lvbnMiOltdLCJuYW1lIjoiSGFycnkgRml0emdlcmFsZCIsImhkIjoibXlwb3J0LmFjLnVrIiwiZ2l2ZW5fbmFtZSI6IkhhcnJ5IiwiZmFtaWx5X25hbWUiOiJGaXR6Z2VyYWxkIiwiaWF0IjoxNTU1NjI0MTg1fQ.2TW1UIozHxsHZ8QIq004qtLq2k5jkFVCIKzGStjRpPY'
const serverHost = 'http://localhost:5000'

const fhirBase = axios.create({
	baseURL: `${serverHost}/fhir`,
	headers: {
		accept: 'application/fhir+json',
		token,
	},
})

const envLoc = path.join(process.cwd(), '.env')
if (fs.existsSync(envLoc)) {
	const lines = fs.readFileSync(envLoc).toString().split('\n')
	lines.forEach((line) => {
		const [key, ...rest] = line.split('=')
		const val = rest.join('=')
		process.env[key] = val
	})
}

const knex = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL,
})


module.exports = {
	token,
	serverHost,
	noPermsToken,
	fhirBase,
	knex,
}
