import { defineStore } from 'pinia';
import { ref } from 'vue';

function authHeaders() {
  const token = localStorage.getItem('winters_token') || '';
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const useCommunityStore = defineStore('community', () => {
  const posts = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const total = ref(0);
  const hasMore = ref(true);
  const category = ref('all');
  const tag = ref('');
  const tags = ref([]);

  async function fetchPosts(reset = false) {
    if (reset) { page.value = 1; posts.value = []; hasMore.value = true; }
    if (loading.value) return;
    loading.value = true;
    try {
      const params = new URLSearchParams({ page: page.value, category: category.value, tag: tag.value });
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

  async function fetchTags() {
    try {
      const res = await fetch('/api/tags');
      tags.value = await res.json();
    } catch (e) { /* ignore */ }
  }

  async function toggleLike(post) {
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      post.liked = data.liked;
      post.likes_count = data.likes_count;
    } catch (e) { /* ignore */ }
  }

  function setCategory(c) { category.value = c; }
  function setTag(t) { tag.value = t; }

  return { posts, loading, page, total, hasMore, category, tag, tags, fetchPosts, fetchTags, toggleLike, setCategory, setTag };
});
