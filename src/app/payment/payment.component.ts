import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  paymentForm: any;

  constructor(private bookingService:AuthService) {}
  

  private mobileScreen = window.matchMedia('(max-width: 990px)');



  private initializeDropdownBehavior(): void {
    document.querySelectorAll('.dashboard-nav-dropdown-toggle').forEach((element) => {
      element.addEventListener('click', (event) => {
        const dropdown = (event.currentTarget as HTMLElement).closest('.dashboard-nav-dropdown');
        dropdown?.classList.toggle('show');
        dropdown?.querySelectorAll('.dashboard-nav-dropdown.show').forEach((child) => {
          child.classList.remove('show');
        });
        dropdown?.parentElement
          ?.querySelectorAll('.dashboard-nav-dropdown.show')
          .forEach((sibling) => {
            if (sibling !== dropdown) sibling.classList.remove('show');
          });
      });
    });
  }

  private initializeMenuToggle(): void {
    document.querySelectorAll('.menu-toggle').forEach((element) => {
      element.addEventListener('click', () => {
        const dashboardNav = document.querySelector('.dashboard-nav');
        const dashboard = document.querySelector('.dashboard');
        if (this.mobileScreen.matches) {
          dashboardNav?.classList.toggle('mobile-show');
        } else {
          dashboard?.classList.toggle('dashboard-compact');
        }
      });
    });
  }
 ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
    this.getBookings();
    
 }

 bookings: any[] = [];
 filteredBookings: any[] = [];
 fullname: string = '';
 paymentAmount: number | null = null;
 paymentDate: Date = new Date();
 paymentMethod: string = '';
 remarks: string = '';
 filterText: string = '';  // Property for filtering input


 getBookings(): void {
   this.bookingService.getBookings().subscribe(
     (response) => {
       this.bookings = response;
       this.filteredBookings = [...this.bookings]; // Initialize filteredBookings with all data
     },
     (error) => {
       console.error('Error fetching bookings:', error);
     }
   );
 }

 onSubmit(): void {
   if (this.fullname && this.paymentAmount && this.paymentDate && this.paymentMethod) {
     const paymentData = {
       fullname: this.fullname,
       paymentAmount: this.paymentAmount,
       paymentDate: this.paymentDate,
       paymentMethod: this.paymentMethod,
       remarks: this.remarks
     };

     this.bookingService.addPayment(paymentData).subscribe(
       (response) => {
         console.log('Payment submitted successfully', response);
         this.resetForm();
       },
       (error) => {
         console.error('Error submitting payment:', error);
       }
     );
   }
 }

 resetForm(): void {
   this.fullname = '';
   this.paymentAmount = null;
   this.paymentDate = new Date();
   this.paymentMethod = '';
   this.remarks = '';
 }

 isInvalid(controlName: string): boolean {
   return this.paymentForm?.controls[controlName]?.invalid && this.paymentForm?.controls[controlName]?.touched;
 }

 getError(controlName: string): string {
   const control = this.paymentForm?.controls[controlName];
   if (control?.hasError('required')) {
     return `${controlName} is required.`;
   }
   if (control?.hasError('min')) {
     return `${controlName} must be a positive number.`;
   }
   return '';
 }

}
