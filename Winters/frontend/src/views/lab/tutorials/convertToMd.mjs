/**
 * JS to MD 转换工具
 * 用于将现有的JS教程数据转换为MD格式
 */
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// 读取JS文件并转换为MD格式
function jsToMd(jsFilePath, mdFilePath) {
  console.log(`Converting: ${jsFilePath} -> ${mdFilePath}`)

  // 动态导入JS模块
  const module = await import(jsFilePath)
  const data = module.default

  if (!data || !data.tutorials) {
    console.error(`Invalid data structure in: ${jsFilePath}`)
    return
  }

  // 构建YAML front matter
  let mdContent = `---
id: ${data.id}
name: ${data.name}
icon: ${data.icon}
version: '${data.version}'
description: ${data.description}
---

`

  // 遍历每个教程
  for (const tutorial of data.tutorials) {
    // 添加教程标题（二级标题 + HTML注释元数据）
    mdContent += `## ${tutorial.title} <!-- tutorial-id: ${tutorial.id} | icon: ${tutorial.icon} | difficulty: ${tutorial.difficulty} -->\n`
    mdContent += `${tutorial.description}\n\n`

    // 遍历每个示例
    for (const example of tutorial.examples) {
      // 添加示例标题（三级标题）
      mdContent += `### ${example.title}\n\n`

      // 添加代码块
      // 根据语言ID确定代码语言标识
      let langId = data.id
      if (langId === 'arkts') langId = 'typescript'
      else if (langId === 'javascript') langId = 'javascript'
      else if (langId === 'typescript') langId = 'typescript'
      else if (langId === 'php') langId = 'php'
      else if (langId === 'java') langId = 'java'
      else if (langId === 'python') langId = 'python'
      else if (langId === 'c') langId = 'c'

      mdContent += `\`\`\`${langId}\n${example.code}\n\`\`\`\n\n`

      // 添加解释（引用块）
      mdContent += `> ${example.explanation}\n\n`
    }
  }

  // 写入MD文件
  fs.writeFileSync(mdFilePath, mdContent, 'utf-8')
  console.log(`✓ Successfully created: ${mdFilePath}`)
}

// 要转换的文件列表
const filesToConvert = [
  { js: 'arkts.js', md: 'arkts.md' },
  { js: 'c.js', md: 'c.md' },
  { js: 'java.js', md: 'java.md' },
  { js: 'javascript.js', md: 'javascript.md' },
  { js: 'php.js', md: 'php.md' },
  { js: 'python.py', md: 'python.md' },  // 注意：原文件名是python.py
  { js: 'typescript.ts', md: 'typescript.md' }  // 注意：原文件名是typescript.ts
]

async function main() {
  console.log('Starting JS to MD conversion...\n')

  for (const file of filesToConvert) {
    const jsPath = path.join(__dirname, file.js)
    const mdPath = path.join(__dirname, file.md)

    try {
      await convertFile(jsPath, mdPath)
    } catch (error) {
      console.error(`Error converting ${file.js}:`, error.message)
    }
  }

  console.log('\nConversion complete!')
}

async function convertFile(jsPath, mdPath) {
  console.log(`\nProcessing: ${path.basename(jsPath)}`)

  // 清除Node.js模块缓存以允许重新导入
  const absoluteJsPath = path.resolve(jsPath)
  delete require.cache[require.resolve(absoluteJsPath)]

  // 使用动态import加载ES模块
  const moduleUrl = `file:///${absoluteJsPath.replace(/\\/g, '/')}`
  const module = await import(moduleUrl)
  const data = module.default

  if (!data || !data.tutorials) {
    throw new Error('Invalid data structure')
  }

  // 构建MD内容
  let mdContent = buildMarkdown(data)

  // 写入文件
  fs.writeFileSync(mdPath, mdContent, 'utf-8')
  console.log(`  ✓ Created: ${path.basename(mdPath)} (${data.tutorials.length} tutorials)`)

  return true
}

function buildMarkdown(data) {
  let content = ''

  // YAML front matter
  content += `---
id: ${data.id}
name: ${data.name}
icon: ${data.icon}
version: '${data.version}'
description: ${data.description}
---

`

  // 教程列表
  for (const tutorial of data.tutorials) {
    content += `## ${tutorial.title} <!-- tutorial-id: ${tutorial.id} | icon: ${tutorial.icon} | difficulty: ${tutorial.difficulty} -->\n`
    content += `${tutorial.description}\n\n`

    for (const example of tutorial.examples) {
      content += `### ${example.title}\n\n`

      // 确定代码语言
      const lang = getCodeLanguage(data.id)
      content += `\`\`\`${lang}\n${example.code}\n\`\`\`\n\n`

      // 解释文本
      content += `> ${example.explanation}\n\n`
    }
  }

  return content
}

function getCodeLanguage(id) {
  const langMap = {
    'arkts': 'typescript',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'php': 'php',
    'java': 'java',
    'python': 'python',
    'c': 'c'
  }
  return langMap[id] || id
}

// 执行转换
main().catch(console.error)
