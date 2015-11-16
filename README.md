# api-signature 

# About

Tell me, why is your project tight as heck?

# Development 

## build the js

Transpile `src/js` to `build/js/bundle.js` using webpack and Babel

## build, watch and serve the app 

Spins up a dev server to host the static files/watches the js files and transpiles on changes.

```shell
npm run serve
```

## lint the js

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

JSX and ES2015 are supported. Add/modify the rules in `.eslintrc` to taste.

```shell
npm run lint 
```

## test

Uses `tape` to run the tests required in `test/index.js`

```shell
npm run test 
```

## deploy

The easy way:
  - `npm run build`
  - commit, tag, etc
  - push to a gh-pages branch on GitHub

Optionally you can host these files with nginx or apache or however you want.
