<script setup>
import './inputfield.css'

const props = defineProps
({
  labelName: { type: String, default: '' },
  small: { type: String, default: '' },
  error: { type: String, default: '' }
});
</script>

<template>
  <div class="field">
    <label class="label-text">{{ labelName }}</label>
    <slot name="body"/>
    <small v-if="small" class="small">
      <i>{{ small }}</i>
    </small>
    <div v-if="error" class="text-danger">
      {{ error }}
    </div>
  </div>
</template>