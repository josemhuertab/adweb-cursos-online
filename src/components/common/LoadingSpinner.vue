<template>
  <div class="loading-spinner">
    <v-progress-circular
      :size="size"
      :width="width"
      :color="color"
      indeterminate
    />
    <p v-if="message" class="loading-spinner__message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: [String, Number],
      default: 40
    },
    width: {
      type: [String, Number],
      default: 4
    },
    color: {
      type: String,
      default: 'primary'
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner__message {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>