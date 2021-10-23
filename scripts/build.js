import fs from 'fs'
import path from 'path'
import util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const copyFile = util.promisify(fs.copyFile)
const mkdir = util.promisify(fs.mkdir)

const OUT_DIR = path.resolve('./dist')
const FILES_TO_COPY = ['./LICENSE.md', './README.md']
// package.json keys to copy to distributed package
const PACKAGE_KEYS = [
  'name',
  'version',
  'license',
  'type',
  'description',
  'respository',
]

const copyFiles = async (to, ...files) => {
  for await (const file of files) {
    await copyFile(file, path.resolve(to, file))
  }
}

const buildManifest = async () => {
  const file = await readFile('./package.json')
  const pkg = JSON.parse(file)
  const manifest = {}

  for (const key of PACKAGE_KEYS) {
    manifest[key] = pkg[key]
  }

  return manifest
}

const build = async () => {
  if (!fs.existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR)
  }

  await copyFiles(OUT_DIR, ...FILES_TO_COPY)

  const manifest = await buildManifest()

  await writeFile(
    path.resolve(OUT_DIR, 'package.json'),
    JSON.stringify(manifest, null, '\t'),
    'utf8'
  )
}

try {
  build()
} catch (err) {
  console.error(err?.message)
}
