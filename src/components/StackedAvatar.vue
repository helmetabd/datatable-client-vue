<script setup lang="ts">
import { getAvatar } from '../utils/assetsHelper'
import { defineProps } from 'vue'
defineProps(['collections', 'link', 'route', 'collectionTitle'])
const avatar = (avatar: string | string[]) => getAvatar(avatar)
</script>
<template>
  <div class="d-flex align-items-center w-2">
    <div class="avatar-group">
      <router-link
        v-for="collection in collections"
        :key="collection.id"
        :title="collection.user.name"
        :aria-label="collection.user.name"
        class="avatar-group-item"
        data-bs-toggle="tooltip"
        data-bs-trigger="hover"
        data-bs-placement="top"
        :to="{
          name: 'company.employees.detail',
          params: { id: collection.id }
        }"
      >
        <div class="avatar-xxs">
          <img :src="avatar(collection.user.avatar)" class="rounded-circle img-fluid" />
        </div>
      </router-link>
    </div>
  </div>
</template>
