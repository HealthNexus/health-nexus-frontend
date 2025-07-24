# 7. Error Handling & Validation

## Objective
Implement robust error handling and form validation for the e-pharmacy features to ensure data integrity and a smooth UX.

## Agent: GitHub Copilot

## Prerequisites
- Quasar form validation rules available
- Store actions throw errors with descriptive messages

## Acceptance Criteria
- Checkout form validations (required fields, proper formats)
- API error notifications displayed
- Validation feedback near inputs

## Execution Steps
1. **Checkout Form Rules**
   ```ts
   const rules = {
     required: (value: string) => !!value || 'Required.',
     address: (value: string) => value.length >= 10 || 'Address too short.',
     payment: (value: string) => ['card', 'paypal'].includes(value) || 'Invalid payment method.',
   };
   ```
2. **Apply Rules in `CheckoutPage.vue`**
   ```vue
   <q-input v-model="address" :rules="[rules.required, rules.address]" />
   <q-select v-model="paymentMethod" :options="['card','paypal']" :rules="[rules.required, rules.payment]" />
   ```
3. **API Error Handling**
   ```ts
   try {
     await store.checkout();
   } catch (err) {
     Notify.create({ type: 'negative', message: err.response?.data.message || err.message });
   }
   ```
4. **Form Feedback**
   - Use `error` and `error-message` props on Quasar inputs

## Next Steps
Write tests to cover validation and error scenarios.
