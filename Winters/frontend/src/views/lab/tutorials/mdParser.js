/**
 * MD教程文件解析器
 * 将Markdown格式的教程数据转换为与原JS格式完全兼容的对象结构
 *
 * MD文件格式规范：
 * - YAML front matter: 存储语言元信息 (id, name, icon, version, description)
 * - 二级标题(##): 标识每个教程，通过HTML注释存储元数据
 * - 三级标题(###): 标识代码示例标题
 * - 代码块: 存储代码内容
 * - 引用块(>): 存储解释文本
 */

/**
 * 解析完整的MD教程文件
 * @param {string} mdContent - MD文件的原始内容
 * @returns {Object} 与原JS格式完全兼容的语言对象
 */
export function parseTutorialMd(mdContent) {
  if (!mdContent || typeof mdContent !== 'string') {
    throw new Error('Invalid markdown content: content is empty or not a string')
  }

  try {
    // 分离front matter和正文内容
    const { frontMatter, content } = separateFrontMatter(mdContent)

    // 解析语言元信息
    const languageInfo = parseFrontMatter(frontMatter)

    // 解析教程列表
    const tutorials = parseTutorials(content)

    return {
      id: languageInfo.id,
      name: languageInfo.name,
      icon: languageInfo.icon,
      version: languageInfo.version,
      description: languageInfo.description,
      tutorials: tutorials
    }
  } catch (error) {
    console.error('Failed to parse tutorial MD:', error)
    throw new Error(`MD parsing error: ${error.message}`)
  }
}

/**
 * 分离YAML front matter和正文内容
 * @param {string} content - 完整的MD内容
 * @returns {{ frontMatter: string, content: string }}
 */
function separateFrontMatter(content) {
  // 检查是否以 --- 开头（YAML front matter标记）
  if (!content.startsWith('---')) {
    // 没有front matter，整个内容都是正文
    return { frontMatter: '', content: content.trim() }
  }

  // 找到第二个 --- （front matter结束标记）
  const secondDelimiter = content.indexOf('---', 3)
  if (secondDelimiter === -1) {
    throw new Error('Invalid YAML front matter: missing closing delimiter')
  }

  const frontMatter = content.slice(3, secondDelimiter).trim()
  const mainContent = content.slice(secondDelimiter + 3).trim()

  return { frontMatter, content: mainContent }
}

/**
 * 解析YAML front matter提取语言信息
 * @param {string} yamlContent - YAML格式的front matter内容
 * @returns {{ id: string, name: string, icon: string, version: string, description: string }}
 */
function parseFrontMatter(yamlContent) {
  const info = {
    id: '',
    name: '',
    icon: '',
    version: '',
    description: ''
  }

  if (!yamlContent) {
    return info
  }

  // 逐行解析YAML键值对
  const lines = yamlContent.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // 跳过空行和注释
    if (!trimmed || trimmed.startsWith('#')) continue

    // 匹配 key: value 格式
    const match = trimmed.match(/^(\w+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      // 去除值两端的引号（如果有）
      const cleanValue = value.replace(/^["']|["']$/g, '').trim()

      if (key in info) {
        info[key] = cleanValue
      }
    }
  }

  return info
}

/**
 * 解析教程列表
 * @param {string} content - MD正文内容（不含front matter）
 * @returns {Array} 教程数组
 */
function parseTutorials(content) {
  const tutorials = []

  // 使用正则匹配所有二级标题及其后续内容
  // 二级标题格式： ## Title <!-- tutorial-id: xxx | icon: xxx | difficulty: xxx -->
  const tutorialRegex = /##\s+(.+?)\s*<!--\s*tutorial-id:\s*([^|]+)\s*\|\s*icon:\s*([^|]+)\s*\|\s*difficulty:\s*([^>]+)\s*-->/g

  let match
  while ((match = tutorialRegex.exec(content)) !== null) {
    const title = match[1].trim()
    const id = match[2].trim()
    const icon = match[3].trim()
    const difficulty = match[4].trim()

    // 获取这个教程的内容范围（从当前匹配位置到下一个 ## 或文件末尾）
    const startIndex = match.index
    const nextHeadingIndex = content.indexOf('\n## ', startIndex + match[0].length)

    let tutorialContent
    if (nextHeadingIndex !== -1) {
      tutorialContent = content.slice(startIndex + match[0].length, nextHeadingIndex).trim()
    } else {
      tutorialContent = content.slice(startIndex + match[0].length).trim()
    }

    // 提取描述（第一个非代码块、非引用块、非标题的段落）
    const description = extractDescription(tutorialContent)

    // 解析代码示例
    const examples = parseExamples(tutorialContent)

    tutorials.push({
      id: id,
      title: title,
      icon: icon,
      description: description,
      difficulty: difficulty,
      examples: examples
    })
  }

  return tutorials
}

/**
 * 提取教程描述（第一个普通段落）
 * @param {string} content - 教程内容
 * @returns {string} 描述文本
 */
function extractDescription(content) {
  // 移除代码块
  const withoutCodeBlocks = removeCodeBlocks(content)

  // 按行处理，找到第一个非空、非注释、非引用块的段落
  const lines = withoutCodeBlocks.split('\n')
  let descriptionLines = []
  let inDescription = false

  for (const line of lines) {
    const trimmed = line.trim()

    // 跳过空行
    if (!trimmed) {
      if (inDescription && descriptionLines.length > 0) break
      continue
    }

    // 跳过标题行（#开头）
    if (trimmed.startsWith('#')) continue

    // 跳过引用块（>开头）
    if (trimmed.startsWith('>')) break

    // 跳过HTML注释
    if (trimmed.startsWith('<!--')) continue

    // 这是一个普通段落
    inDescription = true
    descriptionLines.push(trimmed)
  }

  return descriptionLines.join(' ').trim()
}

/**
 * 解析代码示例列表
 * @param {string} tutorialContent - 教程内容
 * @returns {Array} 示例数组
 */
function parseExamples(tutorialContent) {
  const examples = []

  // 使用正则匹配所有三级标题和其后的代码块及解释
  // 三级标题格式： ### ExampleTitle
  const exampleRegex = /###\s+(.+?)(?:\n|$)/g

  let exampleMatch
  while ((exampleMatch = exampleRegex.exec(tutorialContent)) !== null) {
    const exampleTitle = exampleMatch[1].trim()

    // 获取这个示例的内容范围
    const exampleStartIndex = exampleMatch.index
    const nextExampleIndex = tutorialContent.indexOf('\n### ', exampleStartIndex + exampleMatch[0].length)

    let exampleContent
    if (nextExampleIndex !== -1) {
      exampleContent = tutorialContent.slice(exampleStartIndex + exampleMatch[0].length, nextExampleIndex).trim()
    } else {
      exampleContent = tutorialContent.slice(exampleStartIndex + exampleMatch[0].length).trim()
    }

    // 提取代码块
    const code = extractCodeBlock(exampleContent)

    // 提取解释文本（引用块或普通段落）
    const explanation = extractExplanation(exampleContent)

    if (code || explanation) {
      examples.push({
        title: exampleTitle,
        code: code || '',
        explanation: explanation || ''
      })
    }
  }

  return examples
}

/**
 * 从内容中提取第一个代码块
 * @param {string} content - 内容文本
 * @returns {string} 代码内容
 */
function extractCodeBlock(content) {
  // 匹配 ``` ... ``` 代码块（支持多行）
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g
  const match = codeBlockRegex.exec(content)

  if (match && match[1]) {
    return match[1].trim()
  }

  return ''
}

/**
 * 从内容中提取解释文本
 * @param {string} content - 内容文本
 * @returns {string} 解释文本
 */
function extractExplanation(content) {
  // 方法1: 尝试提取引用块内容
  const quoteRegex = /^>\s*(.+)$/gm
  const quoteMatches = []
  let quoteMatch

  while ((quoteMatch = quoteRegex.exec(content)) !== null) {
    quoteMatches.push(quoteMatch[1].trim())
  }

  if (quoteMatches.length > 0) {
    return quoteMatches.join(' ')
  }

  // 方法2: 如果没有引用块，提取代码块后的第一个普通段落
  const withoutCode = removeCodeBlocks(content)
  const lines = withoutCode.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('<!--'))

  if (lines.length > 0) {
    return lines.join(' ')
  }

  return ''
}

/**
 * 移除内容中的所有代码块
 * @param {string} content - 原始内容
 * @returns {string} 移除代码块后的内容
 */
function removeCodeBlocks(content) {
  return content.replace(/```[\w]*\n[\s\S]*?```/g, '').trim()
}

/**
 * 验证解析结果是否有效
 * @param {Object} parsedData - 解析后的数据对象
 * @returns {boolean} 是否有效
 */
export function validateParsedData(parsedData) {
  if (!parsedData || typeof parsedData !== 'object') return false

  const requiredFields = ['id', 'name', 'icon', 'version', 'description', 'tutorials']
  for (const field of requiredFields) {
    if (!(field in parsedData)) {
      console.error(`Missing required field: ${field}`)
      return false
    }
  }

  if (!Array.isArray(parsedData.tutorials) || parsedData.tutorials.length === 0) {
    console.error('tutorials must be a non-empty array')
    return false
  }

  // 验证每个教程的结构
  for (const tutorial of parsedData.tutorials) {
    const tutorialFields = ['id', 'title', 'icon', 'description', 'difficulty', 'examples']
    for (const field of tutorialFields) {
      if (!(field in tutorial)) {
        console.error(`Tutorial ${tutorial.id || '?'} missing field: ${field}`)
        return false
      }
    }

    if (!Array.isArray(tutorial.examples)) {
      console.error(`Tutorial ${tutorial.id} examples must be an array`)
      return false
    }

    // 验证每个示例的结构
    for (const example of tutorial.examples) {
      const exampleFields = ['title', 'code', 'explanation']
      for (const field of exampleFields) {
        if (!(field in example)) {
          console.error(`Example missing field: ${field}`)
          return false
        }
      }
    }
  }

  return true
}
