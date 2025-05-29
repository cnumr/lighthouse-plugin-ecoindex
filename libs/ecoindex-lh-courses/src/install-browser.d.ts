import { InstalledBrowser } from '@puppeteer/browsers'
export function checkIfMandatoryBrowserInstalled(
  debug?: boolean,
): Promise<InstalledBrowser | null>
export function installMandatoryBrowser(): Promise<InstalledBrowser>
export function getMandatoryBrowserExecutablePath(): Promise<string>
