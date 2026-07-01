// 后端 API 地址
// Vite 开发模式下 /api 会被代理到 localhost:8000，所以用相对路径即可
// 部署时如果前后端分离，改成完整 URL 比如 'https://api.example.com'
export const API_BASE: string = '';

// WebSocket 地址（开发时自动拼，部署时改）
const wsProtocol: string = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
export const WS_BASE: string = `${wsProtocol}//${window.location.host}`;

/** 应用配置选项 */
export interface AppConfig {
  API_BASE: string;
  WS_BASE: string;
}
