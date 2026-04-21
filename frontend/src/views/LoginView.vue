<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useAuthStore } from '../stores/auth'

const LOGIN = gql`
  mutation Login($input: AuthInput!) {
    login(input: $input) {
      token
      user {
        id
        username
      }
    }
  }
`

const username = ref('')
const password = ref('')
const errorMsg = ref('')

const router = useRouter()
const authStore = useAuthStore()
const { mutate: loginMutate, loading } = useMutation(LOGIN)

async function submit() {
  errorMsg.value = ''
  try {
    const result = await loginMutate({ input: { username: username.value, password: password.value } })
    const { token, user } = result!.data.login
    authStore.setAuth(token, user)
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e.message ?? 'Login failed'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Sign In</h2>
      <form @submit.prevent="submit">
        <label>Username</label>
        <input v-model="username" type="text" required placeholder="cooluser" />
        <label>Password</label>
        <input v-model="password" type="password" required placeholder="••••••••" />
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" :disabled="loading">{{ loading ? 'Signing in…' : 'Sign In' }}</button>
      </form>
      <p class="switch">No account? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.auth-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
}
h2 { margin-bottom: 1.5rem; text-align: center; }
label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; }
input {
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
}
button {
  width: 100%;
  padding: 0.6rem;
  background: var(--color-text);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e55; font-size: 0.875rem; margin-bottom: 0.75rem; }
.switch { text-align: center; margin-top: 1rem; font-size: 0.875rem; }
</style>
