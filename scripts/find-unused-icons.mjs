import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2]
const iconFile = path.join(root, 'src/components/primitives/Icon.tsx')
const src = fs.readFileSync(iconFile, 'utf8')
const body = src.slice(src.indexOf('export const icons'), src.indexOf('} satisfies'))
const keys = [...body.matchAll(/^ {2}'?([a-zA-Z-]+)'?: /gm)].map((m) => m[1])

const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(entry.name) && path.resolve(p) !== path.resolve(iconFile)) {
      files.push(p)
    }
  }
}
walk(path.join(root, 'src'))

const all = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const unused = keys.filter((k) => !all.includes(`'${k}'`) && !all.includes(`"${k}"`))

console.log('registry keys:', keys.length)
console.log('used:', keys.length - unused.length)
console.log('unused (' + unused.length + '):')
console.log(unused.join(' '))
