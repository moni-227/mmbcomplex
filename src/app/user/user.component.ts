import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';

@Component({
  selector: 'app-user',
  standalone: false,
  
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{


  bookings: any[] = [];
  filteredBookings: any[] = [];
  searchName: any;
  searchMonth: any;


  constructor(private bookingService:AuthService) {}
  
  ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
    this.getBookings();

    }

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


  downloadImage(base64String: string, fileName: string): void {
    // Ensure the Base64 string has the correct data URI prefix
    if (!base64String.startsWith('data:image')) {
      base64String = `data:image/png;base64,${base64String}`;
    }
  
    // Convert the Base64 string to a Blob
    const binary = atob(base64String.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });
  
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
  
    // Trigger the download and clean up
    link.click();
    URL.revokeObjectURL(link.href);
  }
  

  getImageUrl(base64String: string): string {
    if (!base64String.startsWith('data:image')) {
      base64String = `data:image/png;base64,${base64String}`;
    }
    const binary = atob(base64String.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }
  

  searchCheckInDate: string = '';
  searchCheckOutDate: string = '';
  

  currentPage: number = 1;
  pageSize: number = 6; // Number of bookings per page


  search() {
    // Filter based on both searchName and searchMonth
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesName = this.searchName
        ? booking.fullName.toLowerCase().includes(this.searchName.toLowerCase())
        : true;

      let matchesMonth = true;
      if (this.searchMonth) {
        const checkInMonth = new Date(booking.checkInDate).toISOString().slice(0, 7);
        const checkOutMonth = new Date(booking.checkOutDate).toISOString().slice(0, 7);
        matchesMonth = checkInMonth.startsWith(this.searchMonth) || checkOutMonth.startsWith(this.searchMonth);
      }

      return matchesName && matchesMonth;
    });

    // Reset to the first page after a search
    this.currentPage = 1;
  }

  get paginatedBookings() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(startIndex, startIndex + this.pageSize);
  }

  // Calculate total pages
  get totalPages() {
    return Math.ceil(this.filteredBookings.length / this.pageSize);
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Set a specific page
  setPage(page: number) {
    this.currentPage = page;
  }
  
}
