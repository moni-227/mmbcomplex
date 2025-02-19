import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';
import { jsPDF } from 'jspdf';
import { Router } from '@angular/router';



@Component({
  selector: 'app-download',
  standalone: false,
  
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent implements OnInit{
  private mobileScreen = window.matchMedia('(max-width: 990px)');

  ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
    this.getBookings(); // Fetch all bookings on component load

  }

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

  
  
  bookings: any[] = [];
  filteredBookings: any[] = [];
  paginatedBookings: any[] = [];
  pageSize: number = 6;  // Items per page
  pageIndex: number = 0;  // Current page index
  totalPages: number = 0;  // Total number of pages
  searchName: string = '';
  searchMonth: string = '';

  constructor(private bookingService: AuthService, private router: Router) {}

  search() {
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
    
    this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize);
    this.updatePaginatedBookings();
  }

  getBookings(): void {
    this.bookingService.getBookings().subscribe(
      (response) => {
        this.bookings = response;
        this.filteredBookings = [...this.bookings];
        this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize);
        this.updatePaginatedBookings();
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  updatePaginatedBookings() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBookings = this.filteredBookings.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.updatePaginatedBookings();
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.updatePaginatedBookings();
    }
  }

  selectedBookings: any[] = []; // Store selected bookings

  toggleSelection(booking: any) {
      const index = this.selectedBookings.findIndex(b => b._id === booking._id);
      if (index > -1) {
          this.selectedBookings.splice(index, 1);
      } else {
          this.selectedBookings.push(booking);
      }
  }
  
  isSelected(booking: any): boolean {
      return this.selectedBookings.some(b => b._id === booking._id);
  }
  
  toggleSelectAll(event: any) {
      if (event.target.checked) {
          this.selectedBookings = [...this.paginatedBookings]; // Select all
      } else {
          this.selectedBookings = []; // Deselect all
      }
  }
  
  areAllSelected(): boolean {
      return this.paginatedBookings.length > 0 && this.paginatedBookings.every(b => this.isSelected(b));
  }
  

  downloadPDF() {
    const doc = new jsPDF();
    
    // Set background color for title
    doc.setFillColor(0, 102, 204); // Blue background
    doc.rect(10, 10, 190, 15, 'F'); // Rectangle for title background
  
    // Title
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // White text color
    doc.text('Booking Details', 14, 20);
  
    // Table headers with background color
    const headers = ['Name', 'In-Date', 'Out-Date', 'Advance Amount', 'Rent Amount'];
    let y = 40;
    doc.setFontSize(12);
    doc.setTextColor(0); // Black text
  
    // Header background color
    doc.setFillColor(230, 230, 230); // Light gray
    doc.rect(10, y - 5, 190, 8, 'F');
  
    headers.forEach((header, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(header, 14 + index * 40, y);
    });
  
    // Use selectedBookings instead of all bookings
    this.selectedBookings.forEach((booking, rowIndex) => {
      y += 10;
  
      // Alternate row color for better readability
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 248, 255); // Light blue
        doc.rect(10, y - 5, 190, 8, 'F');
      }
  
      // Add booking data
      doc.setFont('helvetica', 'normal');
      doc.text(booking.fullName, 14, y);
      doc.text(new Date(booking.checkInDate).toLocaleDateString(), 54, y);
      const checkOutDate = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '';
      doc.text(checkOutDate, 94, y);
      doc.text(booking.advanceAmount.toString(), 134, y);
      doc.text(booking.rentAmount.toString(), 174, y);
  
      // Add new page if reaching bottom
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFillColor(230, 230, 230); // Light gray for new page headers
        doc.rect(10, y - 5, 190, 8, 'F');
        headers.forEach((header, index) => {
          doc.text(header, 14 + index * 40, y);
        });
        y += 10;
      }
    });
  
    // Footer with timestamp
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 285);
  
    doc.save('bookings.pdf');
  }
  


  editOutDate(booking: any) {
    // Make sure booking.id exists and is being passed correctly
    console.log('Booking ID:', booking._id);  // Check if the booking ID is being correctly accessed
    this.router.navigate(['main'], { queryParams: { bookingId: booking._id } });
  }
  
  successMessage: string = ''; // Variable to hold success message
  errorMessage: string = '';   // Variable to hold error message


  deleteBooking(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(
      (response) => {
        // Handle successful deletion
        console.log('Booking deleted:', response);
        this.bookings = this.bookings.filter(booking => booking._id !== bookingId); // Remove the booking from the list
        
        // Display success message
        this.successMessage = 'Booking deleted successfully!';
        this.errorMessage = ''; // Clear any previous error message
  
        // Refresh the page after successful deletion
        location.reload();  // This will reload the entire page
      },
      (error) => {
        console.error('Error deleting booking:', error);
  
        // Display error message
        this.errorMessage = 'Error deleting booking. Please try again.';
        this.successMessage = ''; // Clear any previous success message
      }
    );
  }
  
  
}  