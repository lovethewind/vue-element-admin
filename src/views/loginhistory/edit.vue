<template>
  <login-history-detail :is-edit="true" />
</template>

<script>
import LoginHistoryDetail from './components/LoginHistoryDetail'

export default {
  name: 'LoginHistoryEdit',
  components: { LoginHistoryDetail }
}
</script>

