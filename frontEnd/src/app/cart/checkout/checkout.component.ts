import { Component, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { CartService } from '../../services/cart-service.service';
import { Reservation, ReservedItem } from '../../models/reservation.model';
import { ProductService } from '../../services/product.service';
import { ReservedDatesService } from '../../services/reserved-dates.service';
import { BUFFER_DAYS } from '../../shared/constants';
import { EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  loading = false;
  successMessage = 'Your Reservation has been successfully submitted! You will receive a confirmation email within 3-5 business days. Please check your spam folder if you do not see it in your inbox.<br><br>Thank you for choosing Final Touch !';
  errorMessage = '';
  @Output("updateCart") updateCart: EventEmitter<any> = new EventEmitter(); // EventEmitter to notify CartComponent
  
  terms = [
    {
      question: 'Rental amount is due 30 days before event date',
      answer: 'You will receive an invoice by email, and payment must be completed no later than 30 days prior to your event. If your reservation is made less than 30 days in advance, full payment is due within 3 days of confirmation.',
      open: false
    },
    {
      question: 'Cancellations & Refunds accepted 30 days before event',
      answer: 'You may cancel for a full refund up to 30 days before your event.<br>Cancellations made within 30 days of the event may not be eligible for a full refund, depending on the timing and whether items have already been prepared or reserved.',
      open: false
    },
    {
      question: 'Late returns will incur a fee of $50 per day',
      answer: 'If items are not returned by the agreed return date, a $50 fee will be charged for each late day unless alternate arrangements have been approved by Finishing Touch Co. in advance.',
      open: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private reservationService: ReservationService,
    private cartService: CartService,
    private productService: ProductService,
    private reservedDatesService: ReservedDatesService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      notes: [''],
      agreedToTerms: [false, Validators.requiredTrue],
    });
  }

  async submitForm() {

    if (this.checkoutForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // check if all items are still avaliable
    const unavaliableItems = await this.checkCartAvalibility();
    console.log("Unavaliable items: ", unavaliableItems);
    if (unavaliableItems.size > 0) {
      console.log(unavaliableItems.size, " items are unavaliable");
      // show an error message and update the products in the cart
      console.log("Some items are unavaliable: ", unavaliableItems);
      this.removeUnavaliableItems(unavaliableItems);
      this.loading = false;
      return;
    }

    const reservations = this.createReservations();
    console.log('Generated Reservations:', reservations);

    let successfulSubmissions = 0; // track reservations

    // Handle submission (e.g., send to backend API)
    for (const single_reservation of reservations) {
      this.reservationService.addReservation(single_reservation).subscribe(
        (response: Reservation) => { // Specify the response type
          console.log('Reservation added successfully:', response);
          successfulSubmissions++;

          // If all reservations are successfully submitted, clear the cart and close the popup
          if (successfulSubmissions === reservations.length) {
            this.cartService.clearCart(); // todo, clear each cart items after reservation
            this.successMessage = 'Your reservation has been successfully submitted! You will receive a confirmation email within 3-5 business days. Please check your spam folder if you do not see it in your inbox.\nThank you for choosing Final Touch !';
            // this.updateCart.emit('something'); // Notify CartComponent to update cart
            sessionStorage.setItem('reservationSuccess', 'true');
            this.router.navigate(['/reservation-success']);
          }
        },
        (error: any) => {
          console.error('Error adding reservation:', error);
          // display error message if any of the reservations failed
          // todo this.displayError(error);
          this.errorMessage = 'There was an error processing your reservation.<br>Try again, if it still fails, please email your reservation details to finaltouchco.info@gmail.com. Sorry for the inconvenience.';
          // Optionally, you can also clear the cart here if you want to reset it on error
        }
      );
    }
    this.loading = false; // just make sure it always resets the button
  }

    /**
     * Create reservations based on cart items grouped by `datesReserved`.
     */
    createReservations(): Reservation[] {
      // Group cart items by datesReserved
      const reservations: Reservation[] = [];
      const reservationsMap = this.cartService.getReservationMap();

      // Loop through each group (key = date range, value = CartItem[])
      reservationsMap.forEach((groupedItems, key) => {

        // Calculate totals
        const totalPrice = groupedItems.reduce((sum, item) => sum + item.price, 0);
        const totalDeposit = groupedItems.reduce((sum, item) => sum + item.deposit, 0);

        // Create ReservedItem[] from groupedItems
        const reservedItems: ReservedItem[] = groupedItems.map(item => {
          const product = this.productService.getProductSync(item.productId);
            return {
              productId: item.productId,
              name: product?.name ?? item.name,
              price: product?.price ?? item.price,
              deposit: product?.deposit ?? item.deposit,
              description: product?.description ?? "no description avaliable",
              count: item.count
            };
        });

        const resName = this.checkoutForm.value.name.replace(/\s+/g, '') + "-" + Math.random().toString(36).substring(2, 10);

        // Build the reservation object
        const reservation: Reservation = {
          status: 'pending',
          reservationId: resName,
          name: this.checkoutForm.value.name,
          dates: groupedItems[0]?.datesReserved ?? [],
          pickupNotes: "",
          items: reservedItems, // or map to ReservedItem[] if needed
          email: this.checkoutForm.value.email,
          phoneNumber: this.checkoutForm.value.phone,
          customerNotes: this.checkoutForm.value.notes || '',
          price: totalPrice,
          deposit: totalDeposit,
          reservedOn: new Date(),
          invoiceStatus: "",
          paymentStatus: "",
          depositStatus: "",
          myNotes: ""
        };

        reservations.push(reservation);
      });

      return reservations;
    }

    async checkCartAvalibility(): Promise<Map<string, string>> {
      await this.productService.fetchProducts(); // get the most up to date products
      console.log("Checking cart availability...");

      const unavaliableItems: Map<string, string> = new Map<string, string>();
      const cartItems = this.cartService.getItems();
      await Promise.all(cartItems.map(async (item) => {
        // get product to make sure it is still active
        const product = this.productService.getProductSync(item.productId);
        if (product) {
          // check if dates are still avaliable
          console.log('Checking availability for product:', product.name, 'with dates:', item.datesReserved);
          try {
            const reservedDates = await lastValueFrom(this.reservedDatesService.getReservedDatesByProductId(product.productId));
            console.log('Reserved dates for product:', product.name, 'are:', reservedDates);
            const isAvailable = item.datesReserved.every(date => {
              return !reservedDates.some(reservedDate => {
                const d1 = new Date(reservedDate);
                const d2 = new Date(date);
                const diffDays = Math.abs((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= BUFFER_DAYS;
              });
            });
            if (!isAvailable) { // if any of the dates are unavaliable, then notify that item is unavaliable 
              console.log(`Item ${product.name} is NOT available for the selected dates.`);
              unavaliableItems.set(`${item.productId}`, `${item.name}`);
            } else {
              console.log(`Item ${product.name} is available for the selected dates.`);
            }
          } catch (error) {
            console.error('Error fetching reserved dates:', error);
          }
        } else {
          unavaliableItems.set(`${item.productId}`, `${item.name}`);
        }
      }));
      return unavaliableItems;
    }

    removeUnavaliableItems(unavaliableItems: Map<string, string>): void {
      unavaliableItems.forEach((name, productId) => {
        console.warn(`Item ${name} is no longer available. Removing from cart.`);
        // todo display error message to user
        const links = Array.from(unavaliableItems.entries())
          .map(([productId, name]) => `<a href="/product/${productId}" target="_blank">${name}</a>`)
          .join(', ');
        this.errorMessage = `The following items are no longer available:<br><br>${links}.<br><br>They have been removed from your cart. Please check the product availability and try again.`;

        // Remove the item from the cart
        this.cartService.removeFromCart(productId);
        this.updateCart.emit('something');

      });
    }

  toggleAnswer(terms: any[], index: number): void {
    terms.forEach((term, i) => {
      term.open = i === index ? !term.open : false;
    });
  }

  closeErrorPopup() {
    this.errorMessage = '';
  }
}
