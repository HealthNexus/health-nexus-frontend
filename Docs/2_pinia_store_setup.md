# 2. Pinia Store Setup

## Objective
Establish a new Pinia store (`pharmacy.ts`) to manage the e-pharmacy state including product listings, cart operations, and order tracking.

## Agent: GitHub Copilot

## Prerequisites
- Pinia is installed and configured in `src/boot/pinia.ts`.
- `pharmacyService.ts` is implemented with methods: `fetchDrugs`, `placeOrder`, `trackOrder`.

## Acceptance Criteria
- A new store file `src/stores/pharmacy.ts` exists.
- Store contains state: `drugs: Drug[]`, `cart: CartItem[]`, `orders: OrderResponse[]`, `orderStatus: OrderStatus | null`.
- Store actions: 
  - `loadDrugs()` to populate `drugs`
  - `addToCart(drug: Drug)`
  - `removeFromCart(drugId: string)`
  - `checkout()` to post cart and clear it
  - `fetchOrderStatus(orderId: string)` to update `orderStatus`
- Proper error handling and loading flags included.

## Execution Steps
1. **Create the file**
   ```bash
   touch src/stores/pharmacy.ts
   ```
2. **Import dependencies**
   ```typescript
   import { defineStore } from 'pinia';
   import { fetchDrugs, placeOrder, trackOrder, Drug, OrderStatus, OrderResponse } from 'src/services/pharmacyService';
   ```
3. **Define interfaces**
   ```typescript
   export interface CartItem { drug: Drug; quantity: number; }
   ```
4. **Implement the store**
   ```typescript
   export const usePharmacyStore = defineStore('pharmacy', {
     state: () => ({
       drugs: [] as Drug[],
       cart: [] as CartItem[],
       orders: [] as OrderResponse[],
       orderStatus: null as OrderStatus | null,
       loading: false,
       error: '' as string,
     }),

     actions: {
       async loadDrugs() {
         this.loading = true;
         try {
           this.drugs = await fetchDrugs();
         } catch (err) {
           this.error = err.message;
         } finally {
           this.loading = false;
         }
       },

       addToCart(drug: Drug) {
         const existing = this.cart.find(item => item.drug.id === drug.id);
         if (existing) existing.quantity++;
         else this.cart.push({ drug, quantity: 1 });
       },

       removeFromCart(drugId: string) {
         this.cart = this.cart.filter(item => item.drug.id !== drugId);
       },

       async checkout() {
         this.loading = true;
         try {
           const order = await placeOrder({
             items: this.cart.map(item => ({ drugId: item.drug.id, quantity: item.quantity })),
             address: 'TODO: use user address',
             paymentMethod: 'TODO: payment method',
           });
           this.orders.push(order);
           this.cart = [];
           return order;
         } catch (err) {
           this.error = err.message;
           throw err;
         } finally {
           this.loading = false;
         }
       },

       async fetchOrderStatus(orderId: string) {
         this.loading = true;
         try {
           this.orderStatus = await trackOrder(orderId);
         } catch (err) {
           this.error = err.message;
         } finally {
           this.loading = false;
         }
       },
     },
   });
   ```
5. **Register store**
   - Ensure `pharmacy` store is imported and used in components via `usePharmacyStore()`.

## Next Steps
Add routing configuration to expose the e-pharmacy pages.
