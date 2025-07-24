# 1. Define API Services

## Objective
Create a dedicated service layer (`pharmacyService.ts`) to encapsulate all HTTP interactions with the backend e-pharmacy API endpoints.

## Agent: GitHub Copilot

## Prerequisites
- Axios is installed and configured in `src/axios.js`.
- Base API URL (`http://localhost:8000/api`) is defined in `src/constants.ts` or environment variables.

## Acceptance Criteria
- A new file `src/services/pharmacyService.ts` exists.
- The file exports three methods with proper TypeScript types:
  - `fetchDrugs(): Promise<Drug[]>`
  - `placeOrder(orderData: OrderPayload): Promise<OrderResponse>`
  - `trackOrder(orderId: string): Promise<OrderStatus>`
- Error handling and response parsing are implemented.

## Execution Steps
1. **Create the file**
   ```bash
   touch src/services/pharmacyService.ts
   ```
2. **Import dependencies**
   ```typescript
   import axios from 'axios';
   import { API_BASE } from 'src/constants';
   ```
3. **Define interfaces**
   ```typescript
   export interface Drug { id: string; name: string; price: number; description: string; stock: number; }
   export interface OrderPayload { items: Array<{ drugId: string; quantity: number }>; address: string; paymentMethod: string; }
   export interface OrderResponse { orderId: string; status: string; total: number; }
   export interface OrderStatus { orderId: string; status: string; estimatedDelivery: string; }
   ```
4. **Implement methods**
   ```typescript
   export const fetchDrugs = async (): Promise<Drug[]> => {
     try {
       const response = await axios.get<Drug[]>(`${API_BASE}/drugs`);
       return response.data;
     } catch (error) {
       // handle or rethrow
       throw error;
     }
   };

   export const placeOrder = async (orderData: OrderPayload): Promise<OrderResponse> => {
     try {
       const response = await axios.post<OrderResponse>(`${API_BASE}/orders`, orderData);
       return response.data;
     } catch (error) {
       throw error;
     }
   };

   export const trackOrder = async (orderId: string): Promise<OrderStatus> => {
     try {
       const response = await axios.get<OrderStatus>(`${API_BASE}/orders/${orderId}`);
       return response.data;
     } catch (error) {
       throw error;
     }
   };
   ```
5. **Validation**
   - Run a quick smoke test in browser or unit tests to confirm endpoints return expected data.

## Next Steps
Proceed to set up the Pinia store (`pharmacy.ts`) to consume these services.
