export default {
  spec_dir: 'dist/spec',
  spec_files: [
    '**/*[sS]pec.js'
  ],
  helpers: [],
  env: {
    stopSpecOnExpectationFailure: false,
    random: false,
    forbidDuplicateNames: true
  }
};