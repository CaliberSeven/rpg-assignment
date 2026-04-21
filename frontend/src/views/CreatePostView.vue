<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      createdAt
      author {
        username
      }
    }
  }
`

const title = ref('')
const content = ref('')
const errorMsg = ref('')

const router = useRouter()
const { mutate: createPost, loading } = useMutation(CREATE_POST)

async function submit() {
  errorMsg.value = ''
  try {
    await createPost({ input: { title: title.value, content: content.value } })
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e.message ?? 'Failed to create post'
  }
}
</script>

<template>
  <div class="create-page">
    <div class="create-card">
      <h2>New Post</h2>
      <form @submit.prevent="submit">
        <label>Title</label>
        <input v-model="title" type="text" required placeholder="Post title" />
        <label>Content</label>
        <textarea v-model="content" required placeholder="Write your post…" rows="8" />
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <div class="actions">
          <button type="button" class="secondary" @click="router.back()">Cancel</button>
          <button type="submit" :disabled="loading">{{ loading ? 'Publishing…' : 'Publish' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-page {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}
.create-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 640px;
}
h2 { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; }
input, textarea {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
}
.actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
button {
  padding: 0.5rem 1.25rem;
  background: var(--color-text);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button.secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e55; font-size: 0.875rem; margin-bottom: 0.75rem; }
</style>
