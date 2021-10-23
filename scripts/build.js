import fs from 'fs'
import path from 'path'
import util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const OUT_DIR = path.resolve('./dist')

const build = async () => {
  if (!fs.existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR)
  }

  const pkg = await readFile('./scripts/manifest.json')

  await writeFile(path.resolve(OUT_DIR, 'package.json'), pkg, 'utf8')
}

try {
  build()
} catch (err) {
  console.error(err?.message)
}
