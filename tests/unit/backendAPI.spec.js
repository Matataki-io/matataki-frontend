// import { unmock } from 'unmock-node';
import backendAPI from '../../src/api/backend'

const { JSDOM } = require('jsdom')

let window
beforeEach(async function() {
  window = new JSDOM(``, {
    url: 'http://localhost/',
    referrer: 'http://localhost/',
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
    // runScripts: "outside-only"
  }).window
  /*
  window.eval(`
    // This code executes in the jsdom global scope
    globalVariable = typeof XMLHttpRequest === "function";
    navigator = {
      userAgent: 'node.js',
    };
    Date = Date;
  `); */
  // unmock()
})

describe('backendAPI getUser()', function() {
  it('firt test response should be 200', async function() {
    const response = await backendAPI.getUser({ id: 105 })

    expect(response.status).to.equal(200)
  })
})
