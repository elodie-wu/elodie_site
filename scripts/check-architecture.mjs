/**
 * Lightweight static-import audit. No extra packages or browser required.
 * Tests are intentionally outside the runtime entry graph.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entry = path.resolve(root, 'src/main.tsx')
const failures = []
const visited = new Set()
const stack = new Set()
const sourceFiles = []
const display = (file) => path.relative(root, file).replaceAll(path.sep, '/')

function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name)
    if (item.isDirectory()) walk(file)
    else if (/\.(tsx?|css)$/.test(file) && !/\.(test|d)\.ts$/.test(file)) sourceFiles.push(file)
  }
}
function imports(source, file) {
  const patterns = file.endsWith('.css')
    ? [/@import\s+['"]([^'"]+)['"]/g]
    : [
      /\b(?:import|export)\s+(?:type\s+)?[\w*{},\s]+\s+from\s+['"]([^'"]+)['"]/g,
      /\bimport\s*['"]([^'"]+)['"]/g,
    ]
  return patterns.flatMap((pattern) => [...source.matchAll(pattern)].map((match) => match[1]))
}
function visit(file) {
  if (stack.has(file)) { failures.push('Import cycle at ' + display(file)); return }
  if (visited.has(file)) return
  visited.add(file)
  stack.add(file)
  const source = fs.readFileSync(file, 'utf8')
  for (const specifier of imports(source, file)) {
    if (!specifier.startsWith('.')) continue
    const base = path.resolve(path.dirname(file), specifier)
    const target = [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts')]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    if (!target) { failures.push('Missing import ' + specifier + ' in ' + display(file)); continue }
    if (/\.(tsx?|css)$/.test(target)) visit(target)
  }
  stack.delete(file)
}

walk(path.resolve(root, 'src'))
visit(entry)
for (const file of sourceFiles) {
  if (!visited.has(file)) failures.push('Unreferenced source file: ' + display(file))
}
const config = fs.readFileSync('src/config/site.ts', 'utf8')
const homeBackground = config.match(/\bhome:\s*['"]([^'"]+)['"]/)?.[1]
const html = fs.readFileSync('index.html', 'utf8')
if (!homeBackground || !html.includes(`href="./${homeBackground}"`)) {
  failures.push('Homepage preload and configured background do not match')
}
for (const match of config.matchAll(/['"](assets\/[^'"]+)['"]/g)) {
  if (!fs.existsSync(path.resolve('public', match[1]))) failures.push('Missing public asset: ' + match[1])
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Architecture audit passed: ' + visited.size + ' reachable source/style files; no orphan files, missing imports, or cycles.')
}
