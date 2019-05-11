# ASPEN
> FHIR server with UI to record patient vital signs

## Development
### Prerequisites
You'll need the following software packages at the given versions to get developing
* Node.js ^11.x.x
* yarn ^1.12.x
* postgres ^10.6
* Database setup according to `db/schema.psql`

### Setup Commands
Once the software is setup, you need to install project dependencies, configure the application and start the compiler/server in development mode.
1. Install dependencies the project requires: `yarn install`
2. Configure the environment, copy `.env-sample` to `.env` and fill out the missing keys
4. Start the compiler in watch mode: `yarn build:dev`
5. Run the server in watch mode: `yarn dev`

## Running in Production
All you'll need is Docker installed. To start this, from a terminal run `docker-compose up`. You may need to run this as root.