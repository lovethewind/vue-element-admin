<template>
  <author-detail :is-edit="true" />
</template>

<script>
import AuthorDetail from './components/AuthorDetail'

export default {
  name: 'AuthorEdit',
  components: { AuthorDetail }
}
</script>

