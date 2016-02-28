[![Stories in Ready](https://badge.waffle.io/Pajn/meltdown.png?label=ready&title=Ready)](https://waffle.io/Pajn/meltdown)
# Meltdown editor

Why worry about style and format when typing your documents?
Meltdown lets you write your document in markdown so that you only have your text
and basic structure at hand while typing, and then style and format your document
when you are about to release it.

## Todo
This is currently a work in progress and there are a lot of things to do before
it's usable, some of these are:

- Add support for multiple files
- Add exports to things like pdf, html and docx
- Handle images
- Support saving and loading from some online service
- Support comments on the text
- Live editing the same document with multiple users

## Contributing

### Commands
- `npm install` - Install dependencies and perform initial setups
- `npm start` - Starts a dev server on <http://localhost:8080> with hot loading
- `npm run build` - Does a production build in dist
- `npm run lint` - Runs the linter to check for style issues
- `npm run typescript` - Runs typescript to check for typing issues
- `npm run test` - Runs tests
- `npm run build_dev` - Does a development build but outputs to dist
