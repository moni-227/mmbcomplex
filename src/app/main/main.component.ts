import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../login.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main',
  standalone: false,
  
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  hostelBookingForm!: FormGroup;
  bookingId: string | undefined;
  bookingToEdit: any; // Holds the booking to edit (from the database)

  constructor(private fb: FormBuilder,private bookingService:AuthService,private route: ActivatedRoute) {}

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

  frontIdProof: string = ''; // Bind the Base64 string directly to this variable
  backIdProof:string='';
  fullName: string = ''; // Bind the Base64 string directly to this variable
  email:string='';
  phone: string = ''; // Bind the Base64 string directly to this variable
  checkInDate:string='';
  checkOutDate: string = ''; // Bind the Base64 string directly to this variable
  gender:string='';
  paymentMethod:string='';
  advanceAmount: string = ''; // Bind the Base64 string directly to this variable
  rentAmount:string='';
  specialRequests:string='';
  


  initializeForm(): void {
    this.hostelBookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      checkInDate: ['', Validators.required],
      checkOutDate:[''],
      gender: ['', ],
      frontIdProof: ['',],
      backIdProof: ['', ],
      paymentMethod: ['', ],
      advanceAmount: ['', [Validators.required, Validators.min(1)]],
      rentAmount: ['', [Validators.required, Validators.min(1)]],
      specialRequests: [''],
    });
  }
  
  ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
    this.initializeForm();
  
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
      console.log('Booking ID from query params:', this.bookingId);
  
      if (this.bookingId) {
        this.bookingService.getBookingById(this.bookingId).subscribe(
          booking => {
            this.bookingToEdit = booking;
  
            // Convert date to 'yyyy-MM-dd' format
            const formattedCheckInDate = this.formatDate(booking.checkInDate);
            const formattedCheckOutDate = this.formatDate(booking.checkOutDate);
  
            this.hostelBookingForm.patchValue({
              fullName: booking.fullName,
              email: booking.email,
              phone: booking.phone,
              checkInDate: formattedCheckInDate,
              checkOutDate: formattedCheckOutDate,
              gender: booking.gender,
              paymentMethod: booking.paymentMethod,
              advanceAmount: booking.advanceAmount,
              rentAmount: booking.rentAmount,
              specialRequests: booking.specialRequests,
              frontIdProof: booking.frontIdProof, // Patch file name or base64 string if exists
              backIdProof:  booking.backIdProof  // Patch file name or base64 string if exists
            });
  
  
          },
          error => {
            console.error('Error fetching booking:', error);
            alert('Failed to fetch booking details. Please try again.');
          }
        );
      }
    });
  }
  
  // Format date to 'yyyy-MM-dd'
  formatDate(date: string): string {
    if (!date) return '';
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
  }
  
  
  onSubmit(): void {
    if (this.hostelBookingForm.valid) {
      if (this.bookingId) {
        this.bookingService.updateBooking(this.bookingId, this.hostelBookingForm.value)
          .subscribe(
            response => {
              console.log('Booking updated successfully:', response);
              window.alert('Booking updated successfully!');
              this.hostelBookingForm.reset();
            },
            error => {
              console.error('Error updating booking:', error);
              window.alert('Error updating booking. Please try again.');
            }
          );
      } else {
        this.bookingService.createBooking(this.hostelBookingForm.value)
          .subscribe(
            response => {
              console.log('Booking created successfully:', response);
              window.alert('Booking created successfully!');
              this.hostelBookingForm.reset();
            },
            error => {
              console.error('Error creating booking:', error);
              window.alert('Error creating booking. Please try again.');
            }
          );
      }
    } else {
      this.hostelBookingForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
  
  
  
  
  getError(controlName: string): string {
    const control = this.hostelBookingForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length is 3 characters';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (control?.hasError('min')) {
      return 'Value must be greater than or equal to 1';
    }
    return '';
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.hostelBookingForm.get(controlName);
    return control?.invalid === true && (control?.touched === true || control?.dirty === true);
  }


  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      console.log(`Selected file:`, file); // Check the selected file details
      this.convertFileToBase64(file).then(base64 => {
        console.log(`Before patching:`, base64); // Log the Base64 string
        
        const control = this.hostelBookingForm.get(field);
        if (control) {
          // Explicitly use setValue for better clarity
          control.setValue(base64);
          console.log('After patching:', control.value); // Log the updated value
        } else {
          console.log('Form control does not exist for field:', field); // Log if control is missing
        }
      });
    }
  }
  
  
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  
  
}
