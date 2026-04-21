<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`

const NEW_BLOG_POST = gql`
  subscription NewBlogPost {
    newBlogPost {
      id
      title
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`

const { result, loading, subscribeToMore } = useQuery(GET_POSTS, null, { fetchPolicy: 'network-only' })
const posts = computed(() => result.value?.posts ?? [])

subscribeToMore({
  document: NEW_BLOG_POST,
  updateQuery: (prev, { subscriptionData }) => {
    const newPost = subscriptionData.data?.newBlogPost
    if (!newPost || prev.posts.some((p: any) => p.id === newPost.id)) return prev
    return { ...prev, posts: [newPost, ...prev.posts] }
  },
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="home">
    <div class="home-header">
      <h1>Blog Posts</h1>
    </div>

    <p v-if="loading" class="status">Loading…</p>
    <p v-else-if="!posts.length" class="status">No posts yet. Be the first!</p>

    <div v-else class="post-list">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <header>
          <h2>{{ post.title }}</h2>
          <span class="meta">by {{ post.author.username }} · {{ formatDate(post.createdAt) }}</span>
        </header>
        <p class="body">{{ post.content }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
h1 { margin: 0; }
.status { color: var(--color-text); opacity: 0.6; text-align: center; margin-top: 3rem; }
.post-list { display: flex; flex-direction: column; gap: 1.25rem; }
.post-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
}
.post-card header { margin-bottom: 0.75rem; }
.post-card h2 { margin: 0 0 0.25rem; font-size: 1.2rem; }
.meta { font-size: 0.8rem; opacity: 0.6; }
.body { margin: 0; white-space: pre-wrap; line-height: 1.6; }
</style>
