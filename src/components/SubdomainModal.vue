<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold">Nuovo Sottodominio</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sottodominio *</label>
          <input 
            v-model="formData.subdomain" 
            type="text" 
            required
            class="input-field"
            placeholder="Es: api.example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Indirizzo IP</label>
          <input 
            v-model="formData.ipAddress" 
            type="text" 
            class="input-field"
            placeholder="Es: 192.168.1.1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="formData.status" class="input-field">
            <option value="active">Attivo</option>
            <option value="inactive">Inattivo</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea 
            v-model="formData.notes" 
            rows="3"
            class="input-field"
            placeholder="Note aggiuntive..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="close" class="btn-secondary">
            Annulla
          </button>
          <button type="submit" class="btn-primary">
            Aggiungi Sottodominio
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
  subdomain: '',
  ipAddress: '',
  status: 'active',
  notes: ''
});

const resetForm = () => {
  formData.value = {
    subdomain: '',
    ipAddress: '',
    status: 'active',
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