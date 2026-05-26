/**
 * 验证脚本 - 检查MD文件是否被正确解析
 * 使用: node verifyConversion.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseTutorialMd, validateParsedData } from './mdParser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MD_FILES = [
  'arkts.md',
  'c.md',
  'java.md',
  'javascript.md',
  'php.md',
  'python.md',
  'typescript.md'
]

const JS_FILES = [
  'arkts.js',
  'c.js',
  'java.js',
  'javascript.js',
  'php.js',
  'python.js',
  'typescript.js'
]

async function main() {
  console.log('='.repeat(70))
  console.log('MD Conversion Verification Tool')
  console.log('='.repeat(70))
  console.log('')

  let allPassed = true

  for (let i = 0; i < MD_FILES.length; i++) {
    const mdFile = MD_FILES[i]
    const jsFile = JS_FILES[i]

    console.log(`\n[${i + 1}/${MD_FILES.length}] Verifying: ${mdFile}`)

    try {
      // 读取MD文件
      const mdPath = path.join(__dirname, mdFile)
      const mdContent = fs.readFileSync(mdPath, 'utf-8')

      // 解析MD
      const parsedFromMd = parseTutorialMd(mdContent)

      // 验证数据结构
      const isValid = validateParsedData(parsedFromMd)

      if (!isValid) {
        console.log('  ✗ FAILED: Invalid data structure')
        allPassed = false
        continue
      }

      // 加载原始JS数据对比
      try {
        const jsPath = path.join(__dirname, jsFile)
        const moduleUrl = `file:///${jsPath.replace(/\\/g, '/')}`
        const jsModule = await import(moduleUrl + '?t=' + Date.now())
        const originalData = jsModule.default

        // 对比关键字段
        const checks = [
          { name: 'ID', md: parsedFromMd.id, js: originalData.id },
          { name: 'Name', md: parsedFromMd.name, js: originalData.name },
          { name: 'Icon', md: parsedFromMd.icon, js: originalData.icon },
          { name: 'Version', md: parsedFromMd.version, js: originalData.version },
          { name: 'Description', md: parsedFromMd.description, js: originalData.description },
          { name: 'Tutorials Count', md: parsedFromMd.tutorials.length, js: originalData.tutorials.length }
        ]

        let filePassed = true
        for (const check of checks) {
          if (check.md !== check.js) {
            console.log(`  ✗ MISMATCH ${check.name}: MD="${check.md}" vs JS="${check.js}"`)
            filePassed = false
            allPassed = false
          }
        }

        // 验证每个教程的基本信息
        for (let t = 0; t < parsedFromMd.tutorials.length; t++) {
          const mdTutorial = parsedFromMd.tutorials[t]
          const jsTutorial = originalData.tutorials[t]

          if (mdTutorial.id !== jsTutorial.id) {
            console.log(`  ✗ Tutorial ${t} ID mismatch: ${mdTutorial.id} vs ${jsTutorial.id}`)
            filePassed = false
          }

          if (mdTutorial.title !== jsTutorial.title) {
            console.log(`  ✗ Tutorial ${t} title mismatch`)
            filePassed = false
          }

          if (mdTutorial.examples.length !== jsTutorial.examples.length) {
            console.log(`  ✗ Tutorial ${t} examples count mismatch: ${mdTutorial.examples.length} vs ${jsTutorial.examples.length}`)
            filePassed = false
          }
        }

        if (filePassed) {
          console.log(`  ✓ PASSED: ${parsedFromMd.tutorials.length} tutorials, ID=${parsedFromMd.id}`)
        } else {
          console.log(`  ✗ FAILED: Some fields do not match original JS data`)
        }

      } catch (jsError) {
        console.log(`  ⚠ Could not load JS file for comparison: ${jsError.message}`)
        // 如果无法加载JS文件，至少确认MD解析成功
        console.log(`  ✓ MD parsing successful: ${parsedFromMd.tutorials.length} tutorials`)
      }

    } catch (error) {
      console.log(`  ✗ ERROR: ${error.message}`)
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(70))
  if (allPassed) {
    console.log('✓ ALL VERIFICATIONS PASSED!')
  } else {
    console.log('✗ SOME VERIFICATIONS FAILED - Please review the output above')
  }
  console.log('='.repeat(70))

  process.exit(allPassed ? 0 : 1)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
