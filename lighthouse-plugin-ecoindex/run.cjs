#!/usr/bin/env node

const path = require('path')
console.log('Loading run.cjs')
const { runCourses } = require(path.resolve(__dirname, './cli/run'))
console.log('runCourses loaded:', runCourses)

module.exports = { runCourses }
