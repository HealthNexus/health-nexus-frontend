<template>
  <q-page class="blog-page">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Our Latest Blog</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page-padding>
        <div class="blog-section">
          <h2 class="section-title">Our latest blog</h2>
          <div class="blog-cards row justify-around q-gutter-md">
            <q-card v-for="blog in blogs" :key="blog.id" class="blog-card col-12 col-md-4">
              <q-img :src="blog.image" class="card-image" />
              <q-card-section>
                <div class="blog-date">{{ blog.date }}</div>
                <div class="blog-title">{{ blog.title }}</div>
                <div class="blog-description">{{ blog.description }}</div>
                <q-btn flat label="Read more.." class="read-more-button" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page-padding>
    </q-page-container>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      blogs: [
        {
          id: 1,
          date: 'Jan 01, 2023',
          title: 'Clever ways to invest in product to organize your portfolio',
          description: 'Discover smart investment strategies to streamline and organize your portfolio..',
          image: 'https://via.placeholder.com/400x300'
        },
        {
          id: 2,
          date: 'Feb 01, 2023',
          title: 'How to grow your profit through systematic investment with us',
          description: 'Unlock the power of systematic investment with us and watch your profits soar. Our..',
          image: 'https://via.placeholder.com/400x300'
        },
        {
          id: 3,
          date: 'Mar 01, 2023',
          title: 'How to analyze every holdings of your portfolio',
          description: 'Our comprehensive guide will equip you with the tools and insights needed to..',
          image: 'https://via.placeholder.com/400x300'
        }
      ]
    };
  }
};
</script>

<style scoped>
.blog-page {
  text-align: center;
}

.header {
  background-color: #fff;
}

.blog-section {
  padding: 50px 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.blog-cards {
  display: flex;
  justify-content: center;
}

.blog-card {
  max-width: 350px;
  text-align: left;
}

.card-image {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.blog-date {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 10px;
}

.blog-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.blog-description {
  font-size: 1rem;
  margin-bottom: 20px;
}

.read-more-button {
  color: #1e88e5;
  text-transform: none;
  padding: 0;
}
</style>
