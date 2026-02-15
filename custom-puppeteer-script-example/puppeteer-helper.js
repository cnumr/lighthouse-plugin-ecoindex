const TIMEOUT = 30 * 1000;

const env = process.env;

const DEBUG = env.DEBUG === 'true' ? 'debug' : 'info';

/**
 * Utility function to sleep for a given number of milliseconds
 * @param {number} ms
 * @returns
 */
const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Registers various events handlers on the page to have debug information
 * @param page
 */
const registerLogHandlers = (page) =>
  page
    .on('console', (message) =>
      console.log(
        'Console',
        `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
      )
    )
    .on('pageerror', ({ message }) => console.error('Page error', message))
    .on('response', logResponse)
    .on('requestfailed', (request) =>
      console.error(
        'Request failed',
        `${request.failure().errorText} ${request.url()}`
      )
    );

/**
 * Logs any xhr/html http response
 * @param response
 */
const logResponse = (response) => {
  const request = response.request();
  if (
    (request.resourceType() === 'xhr' ||
      request.resourceType() === 'document') &&
    !request.url().includes('google-analytics')
  ) {
    console.log(
      'Response',
      request.resourceType(),
      response.status(),
      response.url()
    );
  }
};

/**
 * Logs the local storage data and checks for the presence of the auth token
 * @param page
 */
const logAuthOktaToken = async (page, _mode = null) => {
  const localStorageData = await page.evaluate(() => {
    /**
     * Utility function to truncate a string to a given length and add ellipsis
     * Must be defined in the "browser" context, otherwise function is unknown
     */
    const ellipsis = (str) => {
      const maxLength = 10;
      if (str && str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
      }
      return str;
    };

    let json = {};
    json.storageLength = localStorage.length;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      json[key] = ellipsis(localStorage.getItem(key));
    }
    return json;
  });

  console.log(
    'Local storage overview',
    JSON.stringify(localStorageData, null, 2)
  );
  const authToken = localStorageData['okta-token-storage'];
  if (!authToken || authToken === '{}') {
    console.log(
      'Warning : no auth token found. Authentication parameters are either wrong or there is a problem in the automation script'
    );
    return false;
  }
  return true;
};

/**
 * Logs the cookies and checks for the presence of the wordpress logged in cookie
 * @param {*} page
 */
const logAuthWordPressCookie = async (page) => {
  const cookies = await page.cookies();
  // console.debug('Cookies overview', JSON.stringify(cookies, null, 2));
  const wpCookie = cookies.find((cookie) =>
    cookie.name.startsWith('wordpress_logged_in_')
  );
  if (!wpCookie) {
    console.warn(
      'Warning : no wordpress logged in cookie found. Authentication parameters are either wrong or there is a problem in the automation script'
    );
    return false;
  } else {
    console.info('WordPress logged in cookie found:', wpCookie.name);
    return true;
  }
};

/**
 * Norlal start Ecoindex flow
 * @param {*} page
 * @param {*} session
 * @param {*} mode
 */
async function startEcoindexPageMesure(page, session, mode) {
  if (mode === 'wordpress') {
    await logAuthWordPressCookie(page);
  } else if (mode === 'okta') {
    await logAuthOktaToken(page);
  } else {
    throw new Error(`Unknown authentication mode: ${mode}`);
  }
  page.setViewport({
    width: 1920,
    height: 1080,
  });
  await sleep(3 * 1000);
  const dimensions = await page.evaluate(() => {
    const body = document.body,
      html = document.documentElement;

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    return {
      width: document.documentElement.clientWidth,
      height: height,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });
  // console.log('dimensions', dimensions)
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -dimensions.height,
    speed: 1000,
  });
}

/**
 * Normal end Ecoindex flow. Wait 3s.
 * @param {*} flow
 * @param {*} snapshotEnabled
 */
async function endEcoindexPageMesure(flow, snapshotEnabled = false) {
  await sleep(3 * 1000);
  if (snapshotEnabled) await flow.snapshot();
}

/**
 * WordPress Connect
 * @param {*} page
 * @param {*} browser
 * @param {*} configuration
 */
async function wpConnect(page, browser, configuration) {
  const { authenticate } = configuration;
  page = await browser.newPage();
  // ^^^ on crée une nouvelle page référencée par 'page' -> il faut lui réaffecter des event handlers
  if (DEBUG === 'debug') registerLogHandlers(page);

  await page.goto(authenticate.loginPage);
  const title_loginpage = await page.title();
  console.info(`page.title login: '${title_loginpage}'`);
  await page.type(authenticate.loginField, authenticate.loginValue);
  await page.type(authenticate.passField, authenticate.passValue);
  await page.click('[type="submit"]');
  try {
    await page.waitForNavigation();
    const title = await page.title();
    console.info(`page.title after login: '${title}'`);
    // close session for next run
    let connected = false;
    const hasCookie = await logAuthWordPressCookie(page);
    console.log('page closed');
    await page.close();
    if (hasCookie) {
      console.info(`Status OK (verified by cookie), authenticated!`);
    }
    if (title.indexOf(configuration.homeTitle) !== -1) {
      connected = true;
      console.info(`Status OK (verified by title), authenticated!`);
    }
    if (!connected) {
      throw new Error(`Not expected page : ${title}. Unauthentified?`);
    }
  } catch (error) {
    throw new Error(`Connection failed!`);
  }
}
/**
 * Okta Connect
 * @param {*} page
 * @param {*} browser
 * @param {*} authenticate
 */
async function oktaConnect(page, browser, configuration) {
  const { authenticate, logInOneStep, homeTitle } = configuration;
  page = await browser.newPage();
  // ^^^ on crée une nouvelle page référencée par 'page' -> il faut lui réaffecter des event handlers
  if (DEBUG === 'debug') registerLogHandlers(page);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.goto(authenticate.loginPage),
    page.waitForSelector('form[method=post]', { timeout: TIMEOUT }),
  ]);
  console.log(`page.title start: '${await page.title()}'`);
  if (logInOneStep) {
    console.log('initiating login with one step flow');
    await oneStepLogin(page, configuration);
  } else {
    console.log('initiating login with two steps flow');
    await twoStepLogin(page, configuration);
  }

  try {
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const title = await page.title();
    let connected = false;
    const hasToken = await logAuthOktaToken(page);
    if (hasToken) {
      connected = true;
      console.log(`Status OK (verified by token), authenticated!`);
    }
    if (title.indexOf(homeTitle) !== -1) {
      connected = true;
      console.log(`Status OK (verified by title), authenticated!`);
    }
    if (!connected) {
      throw new Error(`Not expected page : ${title} > Unauthentified?`);
    }
    console.log(`page.title landend: '${title}'`);
    // logAuthToken(page)
    // close session for next run
    await page.close();
    console.log('page closed');
  } catch (error) {
    throw new Error(`Connection failed! message : ${error}`);
  }
}

/**
 * Process to login flow in one step (i.e. username and password field are on the same page)
 * @param {puppeteer.Page} page
 * @param {object} configuration
 */
async function oneStepLogin(page, configuration) {
  const { authenticate } = configuration;
  const loginField = configuration.loginField || 'input[type=text]';
  const passField = configuration.passField || 'input[type=password]';
  // attendre que le formulaire de login soit injecté dans le DOM.
  await page.waitForSelector('form[method=post]', { timeout: TIMEOUT });
  console.log(`form ready!`);
  await page.waitForSelector(loginField, { timeout: TIMEOUT });
  console.log(`${loginField} ready!`);
  await page.waitForSelector(passField, { timeout: TIMEOUT });
  console.log(`${passField} ready!`);
  await page.waitForSelector('[type="submit"]', { timeout: TIMEOUT });
  console.log(`[type="submit"] ready!`);

  console.log(`page.title auth: '${await page.title()}'`);

  console.log(`filling form with username and password`);
  await page.type(loginField, authenticate.loginValue);
  await page.type(passField, authenticate.passValue);
  const userName = await page.$eval(loginField, (el) => el.value);
  console.debug(`Verif userName: ${userName}`);

  await page.click('[type="submit"]');
  console.log(`Submited password. Waiting for navigation for ${TIMEOUT} ms...`);
  // Hard wait for navigation to let okta and target app process the login
  await sleep(TIMEOUT);
}

/**
 * Process to login flow in two step (i.e. username needs to be submitted before password)
 * @param {puppeteer.Page} page
 * @param {object} configuration
 */
async function twoStepLogin(page, configuration) {
  const { authenticate } = configuration;
  const loginField = configuration.loginField || 'input[type=text]';
  const passField = configuration.passField || 'input[type=password]';
  // attendre que le formulaire de login soit injecté dans le DOM.
  await page.waitForSelector('form[method=post]', { timeout: TIMEOUT });
  console.log(`form ready!`);
  await page.waitForSelector(loginField, { timeout: TIMEOUT });
  console.log(`${loginField} ready!`);
  await page.waitForSelector('[type="submit"]', { timeout: TIMEOUT });
  console.log(`[type="submit"] ready!`);

  console.log(`page.title auth: '${await page.title()}'`);

  console.log(`filling login field`);
  await page.type(loginField, authenticate.loginValue);
  const userName = await page.$eval(loginField, (el) => el.value);
  console.debug(`Verif userName: ${userName}`);
  await page.click('[type="submit"]');
  console.log(`Submitted login, waiting for password field to be available...`);

  await page.waitForSelector(passField, { timeout: TIMEOUT });
  console.log(`${passField} ready!`);
  await page.waitForSelector('[type="submit"]', { timeout: TIMEOUT });
  console.log(`[type="submit"] ready!`);
  console.log(`filling password field`);
  await page.type(passField, authenticate.passValue);

  await page.click('[type="submit"]');
  console.log(`Submited password. Waiting for navigation for ${TIMEOUT} ms...`);
  // Hard wait for navigation to let okta and target app process the login
  await sleep(TIMEOUT);
}

export {
  registerLogHandlers,
  startEcoindexPageMesure,
  endEcoindexPageMesure,
  wpConnect,
  oktaConnect,
};
