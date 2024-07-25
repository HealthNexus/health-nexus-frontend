<template>
  <div class='blog-container'>
    <h1 class="title">Our latest blog</h1>
    <div class='blog-cards'>
      <div class='blog-card' v-for='blog in blogs' :key='blog.id'>
        <img :src='blog.image' :alt='blog.title' class='blog-image' />
        <div class='blog-content'>
          <p class='blog-date'>{{ blog.date }}</p>
          <h3 class='blog-title'>{{ blog.title }}</h3>
          <p class='blog-description'>{{ blog.description }}</p>
          <a :href='blog.link' class='blog-link'>Read more..</a>
        </div>
      </div>
    </div>
  </div>
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
          image: 'Images/diet3.jpg',
          link: '#'
        },
        {
          id: 2,
          date: 'Feb 01, 2023',
          title: 'How to grow your profit through systematic investment with us',
          description: 'Unlock the power of systematic investment with us and watch your profits soar..',
          image: 'Images/diet4.jpg',
          link: '#'
        },
        {
          id: 3,
          date: 'Mar 01, 2023',
          title: 'How to analyze every holding of your portfolio',
          description: 'Our comprehensive guide will equip you with the tools and insights needed to..',
          image: 'Images/diet2.jpg',
          link: '#'
        },
        {
          id: 4,
          date: 'Mar 01, 2023',
          title: 'How to analyze every holding of your portfolio',
          description: 'Our comprehensive guide will equip you with the tools and insights needed to..',
          image: 'Images/diet1.jpg',
          link: '#'
        },
      ]
    };
  }
};
</script>

<style scoped>
.title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 50px;
  margin-bottom: 40px;
  padding: 30px;
}

.blog-container {
  text-align: center;
  padding: 20px;
}

.blog-cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.blog-card {
  width: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.blog-card:hover {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.blog-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-content {
  padding: 15px;
}

.blog-date {
  color: #9e9e9e;
  font-size: 14px;
}

.blog-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.blog-description {
  color: #616161;
  font-size: 16px;
}

.blog-link {
  color: #6200ea;
  text-decoration: none;
  font-weight: bold;
}
</style>
