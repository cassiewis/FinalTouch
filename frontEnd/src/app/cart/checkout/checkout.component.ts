import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  successMessage = '';
  errorMessage = '';
  paymentMethodId: string | null = null;
  customerId: string | null = null;

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

  submitForm() {

  }

  toggleAnswer(terms: any[], index: number): void {
    terms.forEach((term, i) => {
      term.open = i === index ? !term.open : false;
    });
  }
}
