# FYP
> FHIR server with UI to record patient vital signs

## Prerequisites
* Node.js ^11.x.x
* yarn ^1.12.x
* postgres ^10.6
* Database setup according to `db/schema.psql`

## Setup
1. Install dependencies: `yarn`
2. Setup environment: `mv .env-sample .env`
3. Setup the database: `yarn create:db`
4. Build the bundle: `yarn build:prod`
5. Run! `node bin/www`