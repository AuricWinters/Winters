<template>
  <div class="post-detail-page">
    <canvas class="particles-background" />

    <div class="container">
      <!-- 返回链接 -->
      <div class="back-link">
        <router-link to="/community" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {{ t('返回社区') }}
        </router-link>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('加载中...') }}</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <h2>{{ t('加载失败') }}</h2>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchPost">{{ t('重试') }}</button>
      </div>

      <!-- 帖子详情 -->
      <template v-else-if="post">
        <article class="post-card scroll-reveal">
          <!-- 作者信息 -->
          <div class="post-header">
            <div class="author-avatar">{{ post.author_name?.[0] || post.author?.name?.[0] || '?' }}</div>
            <div class="author-info">
              <div class="author-name">{{ post.author_name || post.author?.name || t('匿名用户') }}</div>
              <div class="post-time">{{ formatDate(post.created_at) }}</div>
            </div>
          </div>

          <!-- 标题 -->
          <h1 class="post-title">{{ post.title }}</h1>

          <!-- 正文 -->
          <div class="post-content" v-html="post.content"></div>

          <!-- 标签 -->
          <div class="post-tags" v-if="post.tags && post.tags.length">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
          </div>

          <!-- 互动栏 -->
          <div class="post-actions">
            <button class="action-item" :class="{ liked: post.liked }" @click="handleLike" :disabled="likeLoading">
              <svg viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {{ formatCount(post.likes || post.likes_count || 0) }}
            </button>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {{ formatCount(post.comments_count || post.comments || 0) }}
            </span>
            <span class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {{ formatCount(post.views || post.views_count || 0) }}
            </span>
          </div>
        </article>

        <!-- ═══ 评论区 ═══ -->
        <section class="comment-section scroll-reveal">
          <h2 class="section-title">{{ t('评论') }} <span class="comment-count">({{ commentCount }})</span></h2>

          <!-- 评论表单 -->
          <div class="comment-form">
            <textarea
              v-model="commentContent"
              :placeholder="replyTo ? t('回复') + ' @' + replyTo.author_name : t('写下你的评论...')"
              class="comment-textarea"
              rows="4"
            ></textarea>
            <div class="form-actions">
              <button v-if="replyTo" class="cancel-reply-btn" @click="cancelReply">
                {{ t('取消回复') }}
              </button>
              <button class="submit-btn" @click="submitComment" :disabled="!commentContent.trim() || commentLoading">
                {{ commentLoading ? t('提交中...') : (replyTo ? t('回复') : t('发表评论')) }}
              </button>
            </div>
          </div>

          <!-- 评论加载状态 -->
          <div v-if="commentsLoading" class="loading-state small">
            <div class="loading-spinner"></div>
            <p>{{ t('加载评论中...') }}</p>
          </div>

          <!-- 评论列表 -->
          <div v-else-if="rootComments.length === 0" class="empty-comments">
            <p>{{ t('暂无评论，来写第一条评论吧') }}</p>
          </div>

          <div v-else class="comment-list">
            <div v-for="comment in rootComments" :key="comment.id" class="comment-item">
              <!-- 主评论 -->
              <div class="comment-main">
                <div class="comment-avatar">{{ comment.author_name?.[0] || '?' }}</div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author_name || t('匿名用户') }}</span>
                    <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                  <button class="reply-btn" @click="setReplyTo(comment)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {{ t('回复') }}
                  </button>
                </div>
              </div>

              <!-- 嵌套回复 -->
              <div v-if="comment.replies && comment.replies.length" class="replies">
                <div v-for="reply in comment.replies" :key="reply.id" class="comment-item reply-item">
                  <div class="comment-main">
                    <div class="comment-avatar small">{{ reply.author_name?.[0] || '?' }}</div>
                    <div class="comment-body">
                      <div class="comment-header">
                        <span class="comment-author">{{ reply.author_name || t('匿名用户') }}</span>
                        <span class="comment-time">{{ formatDate(reply.created_at) }}</span>
                      </div>
                      <p class="comment-text">
                        <span v-if="reply.parent_author" class="mention">@{{ reply.parent_author }} </span>
                        {{ reply.content }}
                      </p>
                      <button class="reply-btn" @click="setReplyTo(reply)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        {{ t('回复') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from '../composables/useI18n.js';
import { useParticles } from '../composables/useParticles.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { useToast } from '../composables/useToast.js';

const { t } = useI18n();
const { showToast } = useToast();
const route = useRoute();

useParticles('.particles-background');
useScrollReveal();

const postId = computed(() => route.params.id);

// 帖子数据
const post = ref(null);
const loading = ref(true);
const error = ref('');

// 评论数据
const comments = ref([]);
const commentsLoading = ref(true);
const commentContent = ref('');
const commentLoading = ref(false);
const replyTo = ref(null);
const likeLoading = ref(false);

// 根评论（无 parent_id）
const rootComments = computed(() => comments.value.filter(c => !c.parent_id));

// 评论总数
const commentCount = computed(() => comments.value.length);

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('刚刚');
    if (minutes < 60) return minutes + t('分钟前');
    if (hours < 24) return hours + t('小时前');
    if (days < 7) return days + t('天前');

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  } catch {
    return dateStr;
  }
}

// 格式化数量
function formatCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
}

// 获取帖子详情
async function fetchPost() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`/api/posts/${postId.value}`);
    if (!res.ok) throw new Error(t('请求失败') + ` (${res.status})`);
    const data = await res.json();
    post.value = data;
  } catch (e) {
    error.value = e.message || t('网络错误');
  } finally {
    loading.value = false;
  }
}

// 获取评论
async function fetchComments() {
  commentsLoading.value = true;
  try {
    const res = await fetch(`/api/posts/${postId.value}/comments`);
    if (!res.ok) throw new Error(t('请求失败') + ` (${res.status})`);
    const data = await res.json();
    // 处理嵌套评论：如果 API 返回扁平结构，按 parent_id 组织
    if (Array.isArray(data)) {
      comments.value = nestComments(data);
    } else if (data.comments) {
      comments.value = nestComments(data.comments);
    } else {
      comments.value = [];
    }
  } catch (e) {
    showToast(e.message || t('加载评论失败'), 'error');
    comments.value = [];
  } finally {
    commentsLoading.value = false;
  }
}

// 将扁平评论列表嵌套为树形结构
function nestComments(flatComments) {
  const map = {};
  const roots = [];

  // 先排序：按 created_at 升序
  const sorted = [...flatComments].sort((a, b) => {
    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
  });

  sorted.forEach(c => {
    map[c.id] = { ...c, replies: [] };
  });

  sorted.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
      // 传递父作者名给回复
      map[c.id].parent_author = map[c.parent_id].author_name;
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

// 点赞
async function handleLike() {
  if (likeLoading.value || !post.value) return;
  likeLoading.value = true;
  try {
    const res = await fetch(`/api/posts/${postId.value}/like`, { method: 'POST' });
    if (!res.ok) throw new Error(t('点赞失败'));
    const data = await res.json();
    post.value.liked = data.liked;
    post.value.likes = data.likes_count ?? data.likes ?? (post.value.likes || 0) + (data.liked ? 1 : -1);
    post.value.likes_count = data.likes_count;
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    likeLoading.value = false;
  }
}

// 提交评论
async function submitComment() {
  const content = commentContent.value.trim();
  if (!content || commentLoading.value) return;

  commentLoading.value = true;
  try {
    const body = { content };
    if (replyTo.value) {
      body.parent_id = replyTo.value.id;
      body.parent_author = replyTo.value.author_name;
    }

    const res = await fetch(`/api/posts/${postId.value}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(t('评论提交失败'));

    const newComment = await res.json();

    // 将新评论加入列表
    if (newComment.parent_id) {
      // 查找父评论并添加到其 replies
      const parent = findComment(comments.value, newComment.parent_id);
      if (parent) {
        parent.replies.push({ ...newComment, replies: [] });
      } else {
        // 如果找不到父评论，重新拉取
        await fetchComments();
      }
    } else {
      comments.value.push({ ...newComment, replies: [] });
    }

    commentContent.value = '';
    replyTo.value = null;
    showToast(t('评论成功'), 'success');
  } catch (e) {
    showToast(e.message || t('评论失败'), 'error');
  } finally {
    commentLoading.value = false;
  }
}

// 在评论树中递归查找评论
function findComment(commentList, id) {
  for (const c of commentList) {
    if (c.id === id) return c;
    if (c.replies && c.replies.length) {
      const found = findComment(c.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// 设置回复目标
function setReplyTo(comment) {
  replyTo.value = comment;
  document.querySelector('.comment-textarea')?.focus();
}

// 取消回复
function cancelReply() {
  replyTo.value = null;
  commentContent.value = '';
}

// 初始化
onMounted(() => {
  fetchPost();
  fetchComments();
});

// 修复 scroll-reveal 闪烁：数据异步加载后手动触发
watch([post, comments], () => {
  setTimeout(() => {
    document.querySelectorAll('.post-detail-page .scroll-reveal').forEach(el => el.classList.add('revealed'));
  }, 300);
});
</script>

<style scoped>
/* ═══ 页面容器 ═══ */
.post-detail-page {
  position: relative;
  min-height: 100vh;
  padding-top: 40px;
}

.particles-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ═══ 返回链接 ═══ */
.back-link {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
}

.back-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  transform: translateX(-4px);
}

/* ═══ 加载 & 错误 ═══ */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.loading-state.small {
  padding: 40px 20px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.error-state h2 {
  font-size: 24px;
  color: var(--text-main);
  margin-bottom: 12px;
}

.error-state p {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 24px;
}

.retry-btn {
  padding: 10px 32px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* ═══ 帖子卡片 ═══ */
.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.25s ease;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.post-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.08);
}

/* 作者信息 */
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.post-time {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 2px;
}

/* 标题 */
.post-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 20px;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* 正文 */
.post-content {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.post-content :deep(p) {
  margin-bottom: 16px;
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 16px 0;
}

.post-content :deep(pre) {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 16px 0;
}

.post-content :deep(code) {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  background: rgba(var(--primary-rgb), 0.06);
  padding: 2px 6px;
  border-radius: 4px;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding: 8px 16px;
  margin: 16px 0;
  background: rgba(var(--primary-rgb), 0.03);
  border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
}

.post-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
}

.post-content :deep(a:hover) {
  text-decoration: underline;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.post-content :deep(li) {
  margin-bottom: 6px;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4) {
  color: var(--text-main);
  margin: 24px 0 12px;
  font-weight: 700;
}

.post-content :deep(h1) { font-size: 24px; }
.post-content :deep(h2) { font-size: 20px; }
.post-content :deep(h3) { font-size: 17px; }

/* 标签 */
.post-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.post-tag {
  padding: 4px 12px;
  background: rgba(var(--primary-rgb), 0.06);
  border-radius: 6px;
  font-size: 13px;
  color: var(--primary);
}

/* 互动栏 */
.post-actions {
  display: flex;
  gap: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.2s;
  background: none;
  border: none;
  padding: 0;
}

.action-item:hover {
  color: var(--primary);
}

.action-item.liked {
  color: #e74c3c;
}

.action-item svg {
  width: 18px;
  height: 18px;
}

.action-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ═══ 评论区 ═══ */
.comment-section {
  margin-top: 32px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: 0.1s;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-count {
  font-size: 14px;
  color: var(--text-light);
  font-weight: 400;
}

/* 评论表单 */
.comment-form {
  margin-bottom: 28px;
}

.comment-textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.6;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.comment-textarea::placeholder {
  color: var(--text-light);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.cancel-reply-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-reply-btn:hover {
  border-color: var(--text-light);
  color: var(--text-main);
}

.submit-btn {
  padding: 10px 24px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 空评论 */
.empty-comments {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-light);
  font-size: 14px;
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-main {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.comment-avatar.small {
  width: 30px;
  height: 30px;
  font-size: 12px;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.comment-time {
  font-size: 11px;
  color: var(--text-light);
}

.comment-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 4px 0 8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.mention {
  color: var(--primary);
  font-weight: 600;
}

.reply-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-light);
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.reply-btn:hover {
  background: rgba(var(--primary-rgb), 0.06);
  color: var(--primary);
}

/* 嵌套回复 */
.replies {
  margin-left: 48px;
  padding-left: 16px;
  border-left: 2px solid var(--border-color);
  margin-top: 0;
}

.reply-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.reply-item:last-child {
  border-bottom: none;
}

/* ═══ 动画 ═══ */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══ 响应式 ═══ */
@media (max-width: 900px) {
  .container {
    padding: 0 16px 40px;
  }

  .post-card {
    padding: 24px;
  }

  .post-title {
    font-size: 22px;
  }

  .comment-section {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .post-detail-page {
    padding-top: 20px;
  }

  .post-card {
    padding: 18px;
    border-radius: 12px;
  }

  .post-title {
    font-size: 20px;
  }

  .post-actions {
    gap: 16px;
  }

  .comment-section {
    padding: 18px;
    border-radius: 12px;
  }

  .replies {
    margin-left: 24px;
    padding-left: 10px;
  }
}
</style>
