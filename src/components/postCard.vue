<template>
  <q-card class="post-card" style="max-width: 400px">
    <q-img 
      :src="post?.thumbnail ?? `https://picsum.photos/id/${(post?.id || 1) + 10}/800/400`" 
      :ratio="16 / 9"
    >
      <div class="absolute-bottom text-h6 text-wrap break-words">
        {{ post?.title || 'Post Title' }}
      </div>
    </q-img>
    
    <q-card-section class="text-body1 text-wrap break-words">
      {{ post?.excerpt || 'Post excerpt goes here...' }}
    </q-card-section>
    
    <!-- Show categories -->
    <q-card-actions v-if="post?.disease?.categories && post.disease.categories.length > 0">
      <q-chip
        v-for="category in post.disease.categories"
        :key="category.id"
        :label="category.name"
        color="primary"
        text-color="white"
        size="sm"
        class="q-mr-xs"
      />
    </q-card-actions>
    
    <q-card-actions align="center" class="q-pb-md">
      <q-btn 
        @click="$emit('viewPost', post?.id)"
        color="primary"
        label="Read more"
        no-caps
        rounded
        style="min-width: 120px"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
interface Category {
  id: number;
  name: string;
}

interface Disease {
  id: number;
  name: string;
  categories: Category[];
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  thumbnail?: string;
  disease: Disease;
}

interface Props {
  post?: Post;
}

interface Emits {
  (e: 'viewPost', postId: number | undefined): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped lang="scss">
.post-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .q-img {
    border-radius: 0;
  }
  
  .absolute-bottom {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 20px 16px 16px;
    color: white;
  }
  
  .q-card__section {
    padding: 16px;
  }
  
  .q-card__actions {
    padding: 8px 16px;
    
    &:last-child {
      padding-bottom: 16px;
    }
  }
}
</style>