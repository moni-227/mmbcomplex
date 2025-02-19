import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';

@Component({
  selector: 'app-notpaid',
  standalone: false,
  
  templateUrl: './notpaid.component.html',
  styleUrl: './notpaid.component.css'
})
export class NotpaidComponent implements OnInit{

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
    this.fetchMissingBookings();

    
 }

 notPaidBookings: any[] = []; // To store bookings without payments

  constructor(private paymentService: AuthService) {}

  missingBookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchQuery: string = ''; // To hold the search query


  fetchMissingBookings(): void {
    this.paymentService.getMissingBookings().subscribe(
      (response) => {
        console.log("API Response:", response); // Debugging
  
        if (response.success && Array.isArray(response.missingMonthsData)) {
          this.missingBookings = response.missingMonthsData;
          this.filteredBookings = [...this.missingBookings]; // Ensure it's iterable
        } else {
          this.missingBookings = []; // Prevent errors
          this.filteredBookings = [];
          this.errorMessage = 'No missing bookings found.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error("API Error:", error);
        this.errorMessage = 'An error occurred while fetching data.';
        this.isLoading = false;
      }
    );
  }
  

// Function to filter bookings by full name
searchBookings(): void {
  if (this.searchQuery.trim() === '') {
    this.filteredBookings = [...this.missingBookings]; // Reset when query is empty
  } else {
    this.filteredBookings = this.missingBookings.filter(booking => 
      booking.booking.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}

}