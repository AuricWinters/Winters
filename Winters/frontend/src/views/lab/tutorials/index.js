/**
 * 教程数据入口文件
 * 从MD文件加载教程数据并通过解析器转换为标准格式
 */
import { parseTutorialMd } from './mdParser.js'

// 使用 Vite 的 import.meta.glob 动态导入所有 MD 文件
// { as: 'raw' } 获取原始文本内容而非模块对象
const mdModules = import.meta.glob('./*.md', { as: 'raw', eager: true })

// 将每个 MD 文件内容通过解析器转换为标准数据格式
export const languages = Object.entries(mdModules)
  .map(([path, content]) => {
    try {
      const parsed = parseTutorialMd(content)

      // 验证解析结果
      if (!parsed || !parsed.id || !parsed.tutorials) {
        console.error(`Invalid parsed data from: ${path}`)
        return null
      }

      return parsed
    } catch (error) {
      console.error(`Failed to parse tutorial MD file: ${path}`, error)
      return null
    }
  })
  .filter(Boolean) // 过滤掉解析失败的项

// 保持向后兼容：导出辅助函数按ID查找语言
export function getLanguageById(id) {
  return languages.find(lang => lang.id === id)
}

// 导出所有可用的语言ID列表
export const languageIds = languages.map(lang => lang.id)

console.log(`[Tutorials] Loaded ${languages.length} languages:`, languageIds.join(', '))
