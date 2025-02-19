import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';


@Component({
  selector: 'app-paid',
  standalone: false,
  
  templateUrl: './paid.component.html',
  styleUrl: './paid.component.css'
})
export class PaidComponent implements OnInit{

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
    this.loadPayments(); // Fetch payments when component initializes

    
 }

 payments: any[] = []; // To store payments list
 filteredPayments: any[] = []; // Holds filtered payment data
 searchMonth: string = ''; // Bound to month input
 searchDate: string = ''; // Bound to date input

  constructor(private paymentService:AuthService ) {}

 
  loadPayments(): void {
    this.paymentService.getAllPayments().subscribe(
      (data) => {
        this.payments = data;
        this.filteredPayments = [...this.payments]; // Initially show all payments
      },
      (error) => {
        console.error('Error fetching payments', error);
      }
    );
  }

  // Filter payments based on month and date
  filterPayments(): void {
    let filtered = [...this.payments];

    // Filter by month
    if (this.searchMonth) {
      filtered = filtered.filter(payment => {
        const paymentMonth = payment.paymentDate ? new Date(payment.paymentDate).toISOString().slice(0, 7) : '';
        return paymentMonth === this.searchMonth;
      });
    }

    // Filter by date
    if (this.searchDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = payment.paymentDate ? new Date(payment.paymentDate).toISOString().slice(0, 10) : '';
        return paymentDate === this.searchDate;
      });
    }

    // Update displayed payments
    this.filteredPayments = filtered;
  }

  // Clear all filters
  clearFilters(): void {
    this.searchMonth = '';
    this.searchDate = '';
    this.filteredPayments = [...this.payments]; // Reset the filtered payments to all payments
  }
}
