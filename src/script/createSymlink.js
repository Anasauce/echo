import fs from 'fs'
import path from 'path'

console.log('Creating src symlink')

const SRC_LINK_PATH = path.resolve(__dirname, '../../node_modules/src')
const SRC_LINK_TARGET_PATH = path.resolve(__dirname, '..')

fs.symlinkSync(SRC_LINK_TARGET_PATH, SRC_LINK_PATH, 'dir')
