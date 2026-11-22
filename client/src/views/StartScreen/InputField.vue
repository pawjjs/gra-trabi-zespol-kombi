<script setup>
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

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.1vw;
  text-align: left;
}
.label-text {
  font-size: 1.1vw;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: 600;
  text-align: center;
  color: #575500;
}
.text-danger{
    color: yellow;
    background-color: black;
    padding: 0.2vw;
    text-align: center;
    border-radius: 0.91vw;
}
.small{
    text-align: center;
    text-shadow: 0.1vw 0.1vw yellow;
    font-size: 1.1vw;
}
</style>