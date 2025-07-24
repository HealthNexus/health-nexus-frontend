# 5. State & UI Integration

## Objective
Connect the e-pharmacy UI components to the `usePharmacyStore` and enable user interactions with real-time feedback.

## Agent: GitHub Copilot

## Prerequisites
- UI components and store are created
- Quasar Notify plugin available

## Acceptance Criteria
- Components import and use store actions/state
- Notifications shown for success and error
- Cart persisted in `localStorage`

## Execution Steps
1. **Inject Store in Layout**
   ```ts
   import { usePharmacyStore } from 'src/stores/pharmacy';
   const pharmacy = usePharmacyStore();
   ```
2. **Add Notify**
   ```ts
   import { Notify } from 'quasar';
   ```
3. **Display Notifications**
   ```ts
   function notifySuccess(msg: string) { Notify.create({ type: 'positive', message: msg }); }
   function notifyError(msg: string) { Notify.create({ type: 'negative', message: msg }); }
   ```
4. **Persist Cart**
   - On store initialization, load cart from `localStorage`
   - Watch cart and `localStorage.setItem('pharmacyCart', JSON.stringify(cart))`

5. **UI Integration Examples**
   ```vue
   <!-- Add-to-cart -->
   <q-btn @click="() => { pharmacy.addToCart(drug); notifySuccess('Added to cart'); }" />

   <!-- Checkout -->
   <q-btn @click="checkout" />
   <script setup lang="ts">
   async function checkout() {
     try {
       const order = await pharmacy.checkout();
       notifySuccess(`Order ${order.orderId} placed!`);
     } catch (error) {
       notifyError(error.message);
     }
   }
   </script>
   ```

## Next Steps
Ensure responsiveness and styling in next task.
