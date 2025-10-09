<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold">Aggiungi Tecnologia</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tecnologia *</label>
          <input 
            v-model="formData.technology" 
            type="text" 
            required
            class="input-field"
            placeholder="Es: Node.js, Apache, WordPress..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Versione</label>
          <input 
            v-model="formData.version" 
            type="text" 
            class="input-field"
            placeholder="Es: 18.0.0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select v-model="formData.category" class="input-field">
            <option value="server">Server</option>
            <option value="framework">Framework</option>
            <option value="cms">CMS</option>
            <option value="library">Library</option>
            <option value="database">Database</option>
            <option value="language">Language</option>
            <option value="cdn">CDN</option>
            <option value="analytics">Analytics</option>
            <option value="other">Altro</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea 
            v-model="formData.notes" 
            rows="2"
            class="input-field"
            placeholder="Note aggiuntive..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="close" class="btn-secondary">
            Annulla
          </button>
          <button type="submit" class="btn-primary">
            Aggiungi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  technology: '',
  version: '',
  category: 'other',
  notes: ''
});

const resetForm = () => {
  formData.value = {
    technology: '',
    version: '',
    category: 'other',
    notes: ''
  };
};

const close = () => {
  emit('close');
  resetForm();
};

const handleSubmit = () => {
  emit('submit', formData.value);
  close();
};
</script>