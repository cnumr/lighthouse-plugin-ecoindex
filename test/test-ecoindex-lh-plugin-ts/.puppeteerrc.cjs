// https://pptr.dev/guides/configuration
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  // launch browser for LHCI
  var page = await browser.newPage(context.options)
  // To be set by env vars
  const authenticate = {
    loginPage: `https://greenit.eco/wp-login.php/`,
    loginField: '#user_login',
    loginValue: 'hrenaud',
    passField: '#user_pass',
    passValue: '****',
  }

  // Test if current page is the login URL page
  if (context.url === authenticate.loginPage) {
    console.log(`Authenticate on`, authenticate.loginPage)
    connect(page, browser, authenticate)
  } else {
    const session = await page.target().createCDPSession()
    try {
      await page.goto(context.url, {
        waitUntil: 'networkidle0',
        timeout: 10000, // change timeout to 10s for crashing tests faster.
      })
    } catch (error) {
      console.error('Error getting page:', error.message)
      console.error('Retry...')
      await page.goto(context.url)
    }
    await startEcoindexPageMesure(page, session)
    await endEcoindexPageMesure()
    // close session for next run
    await page.close()
  }
}
async function connect(page, browser, authenticate) {
  page = await browser.newPage()
  await page.goto(authenticate.loginPage)
  await page.type(authenticate.loginField, authenticate.loginValue)
  await page.type(authenticate.passField, authenticate.passValue)
  await page.click('[type="submit"]')
  try {
    await page.waitForNavigation()
    // close session for next run
    await page.close()
    console.log(`Authenticated!`)
  } catch (error) {
    throw new Error(`Connection failed!`)
  }
}

async function startEcoindexPageMesure(page, session) {
  page.setViewport({
    width: 1920,
    height: 1080,
  })
  await new Promise(r => setTimeout(r, 3 * 1000))
  const dimensions = await page.evaluate(() => {
    var body = document.body,
      html = document.documentElement

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    )
    return {
      width: document.documentElement.clientWidth,
      height: height,
      deviceScaleFactor: window.devicePixelRatio,
    }
  })
  // console.log('dimensions', dimensions)
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -dimensions.height,
    speed: 1000,
  })
}

/**
 * End Ecoindex flow. Wait 3s.
 */
async function endEcoindexPageMesure() {
  await new Promise(r => setTimeout(r, 3 * 1000))
}
