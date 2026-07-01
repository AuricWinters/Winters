import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Post {
  id: number;
  title: string;
  content: string;
  liked?: boolean;
  likes_count?: number;
  [key: string]: any;
}

interface Tag {
  id: number;
  name: string;
  [key: string]: any;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('winters_token') || '';
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const useCommunityStore = defineStore('community', () => {
  const posts = ref<Post[]>([]);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const total = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const category = ref<string>('all');
  const tag = ref<string>('');
  const tags = ref<Tag[]>([]);

  async function fetchPosts(reset: boolean = false): Promise<void> {
    if (reset) { page.value = 1; posts.value = []; hasMore.value = true; }
    if (loading.value) return;
    loading.value = true;
    try {
      const params = new URLSearchParams({ page: String(page.value), category: category.value, tag: tag.value });
      const res = await fetch(`/api/posts?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (reset) posts.value = data.posts;
      else posts.value.push(...data.posts);
      total.value = data.total;
      hasMore.value = data.has_more;
      page.value++;
    } catch (e) { console.warn('fetchPosts error', e); }
    finally { loading.value = false; }
  }

  async function fetchTags(): Promise<void> {
    try {
      const res = await fetch('/api/tags');
      tags.value = await res.json();
    } catch (e) { /* ignore */ }
  }

  async function toggleLike(post: Post): Promise<void> {
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      post.liked = data.liked;
      post.likes_count = data.likes_count;
    } catch (e) { /* ignore */ }
  }

  function setCategory(c: string): void { category.value = c; }
  function setTag(t: string): void { tag.value = t; }

  return { posts, loading, page, total, hasMore, category, tag, tags, fetchPosts, fetchTags, toggleLike, setCategory, setTag };
});
