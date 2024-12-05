## Start

- Clone the project
- Run `yarn` or `npm i` to install packages
- Run `yarn start` or `npm run start` OR `yarn run watch` or `npm run watch`

## Stack

- Typescript — Language for the Backend
- OpenAPI (for documentation & design)
- Express JS
- Firebase Admin - for Authentication


## Design

The template enforces a design driven architecture

- You first generate the openAPI spec
- Enter the query, path & request body schema precisely
- Also ensure you generate a 200 response schema
- Must specify the scopes/auth if required
- Once you make modifications, call `yarn generate:types` to generate the typescript types from the doc

## Boilerplate

- The boilerplate in the template allows you to simply create "handlers" for each route that automatically parse the request & type validate the response. See the Handler type in `src/utils/make-api` & an example with `src/routes/login`
- The boilerplate does authentication automatically for routes that require it. No additional configuration is required. If extra scopes are required -- they are automatically detected from the doc & verified against

## Authentication
 - This project template utilizes Firebase Authentication for user authentication. Firebase Authentication is a robust authentication service provided by Google Firebase. It functions as a replacement for JSON Web Tokens (JWT) but offers similar functionality.

 - When a user is authenticated, a custom token is generated as a JWT. This token serves as a means to validate the user's identity.    Firebase Authentication provides methods to verify and decode the custom token, ensuring the user's authentication.