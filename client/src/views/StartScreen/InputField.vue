<script setup>
import './inputfield.css'

const props = defineProps
({
  labelName: { type: String, default: '' },
  small: { type: String, default: '' },
  error: { type: String, default: '' }
});
//const emit = defineEmits(['update:modelValue']);

//function onInput(e) {
//  emit('update:modelValue', props.type === 'file' ? (e.target.files[0] ?? null) : e.target.value);
//}
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