<script>
export default {
  name: "FilePreviewModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["image", "pdf", "doc"].includes(value),
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<template>
  <div v-if="show" class="modal" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">✖</button>

      <!-- Image -->
      <img v-if="type === 'image'" :src="fileUrl" alt="Preview" />

      <!-- PDF / TXT -->
      <iframe
        v-else-if="type === 'pdf'"
        :src="fileUrl"
        frameborder="0"
      ></iframe>

      <!-- Docs (doc, xls, etc) -->
      <iframe
        v-else-if="type === 'doc'"
        :src="'https://view.officeapps.live.com/op/embed.aspx?src=' + fileUrl"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 1rem;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  border-radius: 8px;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
}

.modal-content iframe {
  width: 80vw;
  height: 80vh;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: red;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}
</style>
