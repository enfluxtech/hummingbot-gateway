
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./vvs-sdk.cjs.production.min.js')
} else {
  module.exports = require('./vvs-sdk.cjs.development.js')
}
