<template>
  <login-history-detail :is-edit="false" />
</template>

<script>
import LoginHistoryDetail from './components/LoginHistoryDetail'

export default {
  name: 'LoginHistoryCreate',
  components: { LoginHistoryDetail }
}
</script>

