# React Typescript boilerplate

## Commands
- `npm start` - Starts a dev server on <http://localhost:8080> with hot loading
- `npm run build` - Does a production build in dist
- `npm run lint` - Runs the linter to check for style issues
- `npm run typescript` - Runs typescript to check for typing issues
- `npm run test` - Runs tests
- `npm run build_dev` - Does a development build but outputs to dist

## Included packages
- React 0.14
- React Router 2.0
- Redux 3.3

## Build steps
### Development
1. Compiles with Typescript to ES6
1. Compiles with Babel to ES5
1. Adds react-hot for hot loading of components

### Production
1. Compiles with Typescript to ES6
1. Compiles with Babel to ES5
1. Minifies with UglifyJS

## Branding
Names should be set in:
1. title in index.html
1. name, description, urls in package.json
1. names, urls in deploy.sh
