<template>
  <section class="design-overview">
    <div class="content">
      <div class="text-content">
        <h2>From sketch to real life</h2>
        <p>
          We create spaces that people want to be in. Since 2001 we have helped our clients
          and customers turn ideas and aspirations into reality. The basic philosophy of
          Loftice is to create individual, aesthetically stunning design solutions for our
          customers by employing unique styles and architecture. Even if you don't have a
          ready sketch of what you want - we will help you to get the result you dreamed of.
        </p>
        <p>
          We feel that interior design is one of the most important investments you will ever
          make. Whether your needs are residential or commercial interior design, we are
          always there for a complete commitment to your project, so we can create a place
          you are comfortable to be in.
        </p>
      </div>
      <div class="image-grid">
        <div class="image-item" v-for="(image, index) in images" :key="index">
          <img :src="image.src" :alt="image.alt" />
        </div>
      </div>
    </div>
    <div class="statistics">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { src: '#', alt: 'Image 1' },
        { src: '#', alt: 'Image 2' },
        { src: '#', alt: 'Image 3' },
        // Add more images as needed
      ],
      stats: [
        { value: '10+', label: 'Years' },
        { value: '300+', label: 'Clients' },
        { value: '15+', label: 'Awards' },
        { value: '1500', label: 'Projects' },
      ],
    };
  },
};
</script>

<style scoped>
.design-overview {
  padding: 20px;
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.text-content {
  max-width: 600px;
  margin-bottom: 20px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-item {
  margin: 5px;
}

.statistics {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
}
</style>
