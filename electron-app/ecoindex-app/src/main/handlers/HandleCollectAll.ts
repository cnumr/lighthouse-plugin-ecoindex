import { ChildProcess, spawn } from 'child_process'
import { IpcMainEvent, shell } from 'electron'
import { getNodeDir, getNpmDir, getWorkDir, isDev } from '../../shared/memory'

import { _debugLogs } from '../utils/MultiDebugLogs'
import { _echoReadable } from '../utils/EchoReadable'
import { _sendMessageToFrontLog } from '../utils/SendMessageToFrontLog'
import { convertJSONDatasFromISimpleUrlInput } from '../utils/ConvertJSONDatas'
import fs from 'node:fs'
import { getMainLog } from '../main'
import i18n from '../../configs/i18next.config'
import os from 'node:os'
import path from 'node:path'
import { showNotification } from '../utils/ShowNotification'
import { utils } from '../../shared/constants'

/**
 * Utils, prepare Json Collect.
 * @returns Promise<{
  command: string[]
  nodeDir: string
  workDir: string
}>
 */
export async function _prepareCollect(): Promise<{
    command: string[]
    nodeDir: string
    workDir: string
}> {
    const mainLog = getMainLog().scope('main/prepareCollect')
    // create stream to log the output. TODO: use specified path
    try {
        const _workDir = getWorkDir() as string
        if (!_workDir || _workDir === '') {
            throw new Error('Work dir not found')
        }

        let nodeDir = getNodeDir()
        _debugLogs(`Node dir: ${nodeDir}`)

        const npmDir = getNpmDir()
        _debugLogs(`Npm dir: ${npmDir}`)

        const command = [
            `${npmDir}/lighthouse-plugin-ecoindex/cli/index.js`.replace(
                /\//gm,
                path.sep
            ),
            'collect',
        ]
        if (os.platform() === `win32`) {
            nodeDir = nodeDir.replace(/\\/gm, path.sep)
        }
        return { command, nodeDir, workDir: _workDir }
    } catch (error) {
        mainLog.error('Error in _prepareCollect', error)
    }
}

/**
 * Utils, Collect
 * @param command string[]
 * @param nodeDir string
 * @param event IpcMainEvent
 * @param logStream
 * @returns string
 */
export async function _runCollect(
    command: string[],
    nodeDir: string,
    event: IpcMainEvent,
    isSimple = false
): Promise<string> {
    const mainLog = getMainLog().scope('main/runCollect')
    try {
        const out: string[] = []

        _debugLogs(`runCollect: ${nodeDir} ${JSON.stringify(command, null, 2)}`)
        // const controller = new AbortController()
        // const { signal } = controller
        const childProcess: ChildProcess = spawn(`"${nodeDir}"`, command, {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
            windowsHide: true,
            // signal,
        })

        childProcess.on('exit', (code, signal) => {
            if (isSimple && out.length > 0) {
                const fl = (item: string) => {
                    return item.includes('Report generated')
                }
                const filtered = out.filter(fl)
                const url =
                    'file:///' +
                    filtered
                        .at(-1)
                        .replace(`Report generated: `, ``)
                        .split('generic.report.html')[0] +
                    `generic.report.html`
                mainLog.debug(`url`, url)
                shell.openExternal(url, { activate: true })
            }
            _debugLogs(
                `Child process exited with code ${code} and signal ${signal}`
            )
        })

        childProcess.on('close', (code) => {
            _debugLogs(`Child process close with code ${code}`)
            _debugLogs('Measure done 🚀')
        })

        childProcess.stdout.on('data', (data) => {
            out.push(data.toString())
            _debugLogs(`stdout: ${data}`)
        })

        if (childProcess.stderr) {
            childProcess.stderr.on('data', (data) => {
                _debugLogs(`stderr: ${data.toString()}`)
            })
        }

        childProcess.on('disconnect', () => {
            _debugLogs('Child process disconnected')
        })

        childProcess.on('message', (message, sendHandle) => {
            _debugLogs(`Child process message: ${message}`)
        })

        await _echoReadable(event, childProcess.stdout)
        // controller.abort()
        return 'mesure done'
    } catch (error) {
        mainLog.error('Error in _runCollect', error)
    }
}

/**
 * Handlers, SimpleCollect
 * @param event IpcMainEvent
 * @param urlsList ISimpleUrlInput[]
 * @returns string
 */
export const handleSimpleCollect = async (
    event: IpcMainEvent,
    urlsList: ISimpleUrlInput[]
) => {
    const mainLog = getMainLog().scope('main/handleSimpleCollect')
    if (!urlsList || urlsList.length === 0) {
        throw new Error('Urls list is empty')
    }
    showNotification({
        subtitle: i18n.t('🧩 Simple collect'),
        body: i18n.t('Process intialization.'),
    })

    const { command, nodeDir, workDir: _workDir } = await _prepareCollect()
    _debugLogs('Simple measure start, process intialization...')
    _debugLogs(`Urls list: ${JSON.stringify(urlsList)}`)
    try {
        urlsList.forEach((url) => {
            if (url.value) {
                command.push('-u')
                command.push(url.value)
            }
        })
        command.push('-o')
        command.push('html')
        command.push('--output-path')
        command.push(`${_workDir}`)
        // Fake mesure and path. TODO: use specified path and urls
        showNotification({
            subtitle: i18n.t(' 🚀Simple collect'),
            body: i18n.t('Collect started...'),
        })
        try {
            if (isDev())
                mainLog.debug(`before (simple) runCollect`, nodeDir, command)

            await _runCollect(command, nodeDir, event, true)
        } catch (error) {
            showNotification({
                subtitle: i18n.t('🚫 Simple collect'),
                body: i18n.t(`Collect KO, {{error}}\n`, { error }),
            })
            throw new Error('Simple collect error')
        }
        // process.stdout.write(data)
        showNotification({
            subtitle: i18n.t('🎉 Simple collect'),
            body: i18n.t(
                `Collect done, you can consult reports in\n{{_workDir}}`,
                { _workDir }
            ),
        })
        if (isDev()) mainLog.debug('Simple collect done 🚀')
        return 'collect done'
    } catch (error) {
        _debugLogs(`stderr: ${error}`)
    }
    // alert process done
}

/**
 * Handler, JsonSaveAndCollect
 * @param event IpcMainEvent
 * @param jsonDatas IJsonMesureData
 * @param andCollect boolean
 * @returns string
 */
export const handleJsonSaveAndCollect = async (
    event: IpcMainEvent,
    jsonDatas: IJsonMesureData,
    andCollect: boolean
) => {
    const mainLog = getMainLog().scope('main/handleJsonSaveAndCollect')
    if (!jsonDatas) {
        throw new Error('Json data is empty')
    }
    showNotification({
        subtitle: andCollect
            ? i18n.t('🧩 JSON save and collect')
            : i18n.t('🧩 JSON save'),
        body: i18n.t('Process intialization.'),
    })
    _debugLogs('Json save or/and collect start...')

    try {
        const _workDir = await getWorkDir()
        if (!_workDir || _workDir === '') {
            throw new Error('Work dir not found')
        }
        if (isDev()) mainLog.debug(`Work dir: ${_workDir}`)
        const jsonFilePath = `${_workDir}/${utils.JSON_FILE_NAME}`
        const jsonStream = fs.createWriteStream(jsonFilePath)
        showNotification({
            subtitle: andCollect
                ? i18n.t('🚀 JSON save and collect')
                : i18n.t('🚀 JSON save'),
            body: andCollect
                ? i18n.t('Json save and collect started...')
                : i18n.t('Json save started...'),
        })
        try {
            if (jsonDatas && typeof jsonDatas === 'object') {
                jsonStream.write(
                    JSON.stringify(
                        convertJSONDatasFromISimpleUrlInput(jsonDatas),
                        null,
                        2
                    )
                )
            } else {
                mainLog.error('jsonDatas have a problem!')
                throw new Error('jsonDatas have a problem!')
            }
        } catch (error) {
            showNotification({
                subtitle: andCollect
                    ? i18n.t('🚫 JSON save and collect')
                    : i18n.t('🚫 JSON save'),
                body: i18n.t('Json file not saved.'),
            })
            _debugLogs(`Error writing JSON file. ${error}`)
            throw new Error(`Error writing JSON file. ${error}`)
        }
        if (!andCollect) {
            showNotification({
                subtitle: i18n.t('💾 JSON save'),
                body: i18n.t('Json file saved.'),
            })
        } else {
            if (isDev()) mainLog.debug('Json measure start...')

            const {
                command,
                nodeDir,
                workDir: _workDir,
            } = await _prepareCollect()
            _debugLogs('Json measure start...')
            _debugLogs(`JSON datas ${JSON.stringify(jsonDatas, null, 2)}`)
            command.push('--json-file')
            command.push(_workDir + '/' + utils.JSON_FILE_NAME)
            command.push('--output-path')
            command.push(`${_workDir}`)
            try {
                await _runCollect(command, nodeDir, event)
            } catch (error) {
                mainLog.error('Simple collect error', error)
                throw new Error('Simple collect error')
            }
            showNotification({
                subtitle: i18n.t('🎉 JSON collect'),
                body: i18n.t(
                    `Measures done, you can consult reports in\n{{_workDir}}`,
                    { _workDir }
                ),
            })
            _debugLogs('Json collect done 🚀')
            return 'measure done'
        }
    } catch (error) {
        if (!andCollect) {
            _sendMessageToFrontLog('ERROR, Json file not saved', error)
            _debugLogs('ERROR, Json file not saved', error)
            showNotification({
                subtitle: i18n.t('🚫 JSON save'),
                body: i18n.t('Json file not saved.'),
            })
        } else {
            _sendMessageToFrontLog(
                'ERROR, Json file not saved or collect',
                error
            )
            _debugLogs('ERROR, Json file not saved or collect', error)
            showNotification({
                subtitle: i18n.t('🚫 JSON save and collect'),
                body: i18n.t('Json file not saved or collect.'),
            })
        }
    }
}
