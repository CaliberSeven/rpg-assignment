<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const NEW_BLOG_POST = gql`
  subscription NewBlogPost {
    newBlogPost {
      id
      title
      author {
        username
      }
    }
  }
`

interface Notification {
  id: number
  message: string
}

const notifications = ref<Notification[]>([])

const { result } = useSubscription(NEW_BLOG_POST)

watch(result, (val) => {
  if (!val?.newBlogPost) return
  const { id, title, author } = val.newBlogPost
  const notif: Notification = { id: Date.now(), message: `New post by ${author.username}: "${title}"` }
  notifications.value.push(notif)
  setTimeout(() => dismiss(notif.id), 5000)
})

function dismiss(id: number) {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}
</script>

<template>
  <div class="notif-container">
    <TransitionGroup name="notif">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notif"
        @click="dismiss(n.id)"
      >
        <span>{{ n.message }}</span>
        <button aria-label="dismiss">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notif-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 100;
}
.notif {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-text);
  color: var(--color-background);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  max-width: 360px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  font-size: 0.875rem;
}
.notif button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
  flex-shrink: 0;
}
.notif-enter-active, .notif-leave-active { transition: all 0.3s ease; }
.notif-enter-from { opacity: 0; transform: translateX(100%); }
.notif-leave-to { opacity: 0; transform: translateX(100%); }
</style>
