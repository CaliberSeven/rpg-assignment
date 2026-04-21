<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import NotificationBanner from './components/NotificationBanner.vue'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">BlogApp</RouterLink>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/create">New Post</RouterLink>
          <span class="username">{{ authStore.user?.username }}</span>
          <button class="nav-btn" @click="logout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Sign In</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <NotificationBanner />
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: var(--color-text);
}
nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.9rem;
}
nav a {
  text-decoration: none;
  color: var(--color-text);
  opacity: 0.75;
}
nav a:hover, nav a.router-link-exact-active { opacity: 1; }
.username { opacity: 0.6; font-size: 0.85rem; }
.nav-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
}
main { padding: 0; }
</style>
