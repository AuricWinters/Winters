/**
 * 批量转换JS教程文件为MD格式的自动化脚本
 * 使用方式: node convertAllToMd.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TUTORIALS_DIR = __dirname

// 语言ID到代码语法高亮标识的映射
const LANG_MAP = {
  'arkts': 'typescript',
  'javascript': 'javascript',
  'typescript': 'typescript',
  'php': 'php',
  'java': 'java',
  'python': 'python',
  'c': 'c'
}

// 要转换的文件列表
const FILES = [
  { js: 'arkts.js', md: 'arkts.md' },
  { js: 'c.js', md: 'c.md' },
  { js: 'java.js', md: 'java.md' },
  { js: 'javascript.js', md: 'javascript.md' },
  { js: 'php.js', md: 'php.md' },
  { js: 'python.js', md: 'python.md' },
  { js: 'typescript.js', md: 'typescript.md' }
]

/**
 * 将JS数据对象转换为Markdown字符串
 */
function buildMarkdown(data) {
  const lang = LANG_MAP[data.id] || data.id
  let md = ''

  // YAML front matter
  md += `---
id: ${data.id}
name: ${data.name}
icon: ${data.icon}
version: '${data.version}'
description: ${data.description}
---

`

  // 遍历教程
  for (const tutorial of data.tutorials) {
    md += `## ${tutorial.title} <!-- tutorial-id: ${tutorial.id} | icon: ${tutorial.icon} | difficulty: ${tutorial.difficulty} -->\n`
    md += `${tutorial.description}\n\n`

    for (const example of tutorial.examples) {
      md += `### ${example.title}\n\n`
      md += `\`\`\`${lang}\n${example.code}\n\`\`\`\n\n`
      md += `> ${example.explanation}\n\n`
    }
  }

  return md
}

/**
 * 转换单个文件
 */
async function convertFile(jsFileName, mdFileName) {
  const jsPath = path.join(TUTORIALS_DIR, jsFileName)
  const mdPath = path.join(TUTORIALS_DIR, mdFileName)

  console.log(`Processing: ${jsFileName} -> ${mdFileName}`)

  try {
    // 动态导入JS模块
    const moduleUrl = `file:///${jsPath.replace(/\\/g, '/')}`
    const module = await import(moduleUrl + '?t=' + Date.now()) // 加时间戳避免缓存
    const data = module.default

    if (!data || !data.tutorials) {
      throw new Error('Invalid data structure: missing tutorials array')
    }

    // 构建MD内容
    const mdContent = buildMarkdown(data)

    // 写入MD文件
    fs.writeFileSync(mdPath, mdContent, 'utf-8')

    console.log(`  ✓ Success: ${data.tutorials.length} tutorials converted`)
    return true
  } catch (error) {
    console.error(`  ✗ Error converting ${jsFileName}:`, error.message)
    return false
  }
}

/**
 * 主函数 - 批量转换所有文件
 */
async function main() {
  console.log('='.repeat(60))
  console.log('JS to Markdown Batch Converter')
  console.log('='.repeat(60))
  console.log(`Working directory: ${TUTORIALS_DIR}`)
  console.log('')

  let successCount = 0
  let failCount = 0

  for (const file of FILES) {
    const success = await convertFile(file.js, file.md)
    if (success) {
      successCount++
    } else {
      failCount++
    }
    console.log('')
  }

  console.log('='.repeat(60))
  console.log(`Conversion complete! Success: ${successCount}, Failed: ${failCount}`)
  console.log('='.repeat(60))
}

// 执行主函数
main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
