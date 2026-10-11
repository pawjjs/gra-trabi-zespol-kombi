<script setup>
const props = defineProps({
  labelName: String,
  modelValue: { type: [String, File], default: '' },
  type: { type: String, default: 'text' },
  small: String,
  error: String,
  autocomplete: String,
  accept: String,
});
const emit = defineEmits(['update:modelValue']);

function onInput(e) {
  emit('update:modelValue', props.type === 'file' ? (e.target.files[0] ?? null) : e.target.value);
}
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label>{{ labelName }}</label>
    <input
      :type="type"
      :value="type === 'file' ? undefined : modelValue"
      :autocomplete="autocomplete"
      :accept="accept"
      :aria-invalid="!!error"
      @input="onInput"
    />
    <small v-if="error" class="field__error">{{ error }}</small>
    <small v-else-if="small" class="field__hint">{{ small }}</small>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}
label {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}
input {
  padding: 9px 11px;
  font-size: 15px;
  color: #111;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 6px;
}
input:focus {
  outline: 2px solid #ffeb00;
  border-color: #111;
}
.field--error input {
  border-color: #c62828;
}
.field__error {
  color: #c62828;
  font-size: 12px;
}
.field__hint {
  color: #666;
  font-size: 12px;
}
</style>