<script setup lang="ts">
import "@fortawesome/fontawesome-free/scss/fontawesome.scss"
import "@fortawesome/fontawesome-free/scss/regular.scss"
import "@fortawesome/fontawesome-free/scss/solid.scss"
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
html,
body {
  position: relative;
  height: 100%;
  margin: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
    Helvetica Neue, Helvetica, Arial, sans-serif;
  font-feature-settings: normal;
  font-variation-settings: normal;
  color: #333333;
  -moz-tab-size: 4;
  tab-size: 4;
  -webkit-tap-highlight-color: transparent;
}

h2 {
  margin-top: 0;
}

.button-list {
  margin-top: 1rem;
  display: flex;
  gap: 5px;
  justify-content: flex-end;
  margin-top: 1rem;
  align-items: flex-end;
  position: relative;

  &.top {
    margin-top: 0;

    & + * {
      margin-top: -1.6rem;
    }
  }
}

button {
  padding: 5px 10px;
  font-size: 110%;
  color: #555555;
  cursor: pointer;
  height: 2em;
}

label {
  display: block;
}

form .fields {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
}

form .fields label {
  justify-self: end;
  margin-right: 10px;
}

input {
  padding: 10px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

input,
input:focus {
  outline-color: red;
}

input:placeholder-shown,
input:placeholder-shown:focus {
  outline-color: inherit;
}

input.valid,
input.valid:focus {
  outline-color: green;
}

button:disabled {
  cursor: not-allowed;
}

#__nuxt {
  height: 100%;
}

.error {
  color: red;
}

@media print {
  @page {
    size: A4 portrait;
  }

  h1 {
    padding: 10px;
  }

  button,
  .group {
    display: none;
  }
}
</style>
