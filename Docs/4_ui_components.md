# 4. UI Components

## Objective
Create and implement the e-pharmacy user interface components for listing drugs, product details, cart management, checkout form, and order status.

## Agent: GitHub Copilot

## Prerequisites
- Quasar Framework components and styling available
- `usePharmacyStore` store setup

## Acceptance Criteria
- Pages: `EPharmacyPage.vue`, `ProductDetails.vue`, `CheckoutPage.vue`, `OrderStatusPage.vue` exist under `src/pages`
- Component: `Cart.vue` under `src/components`
- UI follows Quasar design with responsive grid and Tailwind classes

## Execution Steps

### 4.1 EPharmacyPage.vue
1. **Create file**
   ```bash
   touch src/pages/EPharmacyPage.vue
   ```
2. **Template**
   ```vue
   <template>
     <div class="epharmacy-page">
       <q-input v-model="search" placeholder="Search drugs" class="q-mb-md"/>
       <div class="q-gutter-md row">
         <q-card
           v-for="drug in filteredDrugs"
           :key="drug.id"
           class="col-12 col-sm-6 col-md-4 rounded-card"
         >
           <q-card-section>
             <h3>{{ drug.name }}</h3>
             <p>{{ drug.description }}</p>
             <p class="text-weight-bold">${{ drug.price.toFixed(2) }}</p>
           </q-card-section>
           <q-card-actions>
             <q-btn label="View" @click="goToDetails(drug.id)" />
             <q-btn label="Add to Cart" color="primary" @click="add(drug)" />
           </q-card-actions>
         </q-card>
       </div>
     </div>
   </template>
   ```
3. **Script**
   ```ts
   <script setup lang="ts">
   import { ref, computed, onMounted } from 'vue';
   import { useRouter } from 'vue-router';
   import { usePharmacyStore } from 'src/stores/pharmacy';

   const store = usePharmacyStore();
   const router = useRouter();
   const search = ref('');

   onMounted(() => { store.loadDrugs(); });
   const filteredDrugs = computed(() => 
     store.drugs.filter(d => d.name.toLowerCase().includes(search.value.toLowerCase()))
   );

   function goToDetails(id: string) { router.push({ name: 'productDetails', params: { id } }); }
   function add(drug) { store.addToCart(drug); }
   </script>

   <style scoped>
   .epharmacy-page { padding: 20px; }
   </style>
   ```

### 4.2 ProductDetails.vue
...existing code...
{ implement detailed view, fetch drug by ID using store or service }

### 4.3 Cart.vue
...existing code...
{ show cart items from store, quantity controls, total price }

### 4.4 CheckoutPage.vue
...existing code...
{ form for address & payment, summary, submit triggers `checkout()` }

### 4.5 OrderStatusPage.vue
...existing code...
{ fetch and display order status via `fetchOrderStatus(id)` }

## Next Steps
Integrate components with store and add styling enhancements.
