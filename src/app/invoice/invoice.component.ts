import { Component } from '@angular/core';
import { AuthService } from '../login.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice',
  standalone: false,
  
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  private mobileScreen = window.matchMedia('(max-width: 990px)');
  payments: any[] = [];
  filteredPayments: any[] | undefined;
  selectedPayment: any;

constructor(private AuthService:AuthService){}

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

    this.loadPayments();
 }
//  loadPayments(): void {
//   this.AuthService.getAllPayments().subscribe(
//     (data) => {
//       this.payments = data;
//       console.log('Payments Data:', this.payments);  // Log the payments data to inspect
//       this.filteredPayments = data.map(payment => ({
//         fullName: payment.HostelBookingId.fullName,
//         paymentAmount: payment.paymentAmount,
//         paymentDate: payment.paymentDate,
//         paymentMethod: payment.paymentMethod,
//         remarks: payment.remarks
//       }));
      
//     },
//     (error) => {
//       console.error('Error fetching payments', error);
//     }
//   );
// }
searchText: string = '';


loadPayments(): void {
  this.AuthService.getAllPayments().subscribe(
    (data) => {
      this.payments = data;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Filter payments based on the current month and year
      this.filteredPayments = data.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).map(payment => ({
        fullName: payment.HostelBookingId.fullName,
        paymentAmount: payment.paymentAmount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        remarks: payment.remarks
      }));
    },
    (error) => {
      console.error('Error fetching payments', error);
    }
  );
}

// Function to filter payments by full name
filterByName(): void {
  const searchLower = this.searchText.toLowerCase().trim();
  if (!searchLower) {
    this.loadPayments(); // Reset to all payments if search is empty
    return;
  }

  this.filteredPayments = this.payments.filter(payment =>
    payment.HostelBookingId.fullName.toLowerCase().includes(searchLower)
  ).map(payment => ({
    fullName: payment.HostelBookingId.fullName,
    paymentAmount: payment.paymentAmount,
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    remarks: payment.remarks
  }));
}



viewReceipt(payment: any) {
  // Toggle selectedPayment or simply assign the full payment object.
  if (this.selectedPayment === payment) {
    this.selectedPayment = null;
  } else {
    this.selectedPayment = payment;
  }
}
downloadReceipt(payment: any): void {
  const doc = new jsPDF();

  // === Header Section with Colored Background ===
  // Draw a filled rectangle for the header background
  doc.setFillColor(60, 141, 188); // A pleasant blue shade
  doc.rect(0, 0, 210, 30, 'F');

  // Add the title in the header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('MMB Complex Hostel', 105, 20, { align: 'center' });

  // === Reset Text Color for Main Body ===
  doc.setTextColor(0, 0, 0);

  // Draw a separator line right below the header
  doc.setLineWidth(1);
  doc.line(10, 35, 200, 35);

  // === Payment Details Header ===
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Receipt', 14, 45);

  // Underline the "Invoice Receipt" header for extra style
  doc.setLineWidth(0.5);
  doc.line(14, 47, 60, 47);

  // === Payment Message ===
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dear ${payment.fullName.toUpperCase()},`, 14, 55);
  doc.text(
    'This is the official receipt for your payment. Please find the details below:',
    14,
    65
  );

  // === Payment Details Box ===
  // Draw a light gray border box to enclose the payment details
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(10, 70, 190, 40);

  // Populate the payment details inside the box
  doc.text(`Amount Paid: ${payment.paymentAmount} INR`, 14, 80);
  doc.text(
    `Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}`,
    14,
    90
  );
  doc.text(`Payment Method: ${payment.paymentMethod}`, 14, 100);

  if (payment.remarks) {
    doc.text(`Remarks: ${payment.remarks}`, 14, 110);
  }

  // === Footer Section ===
  // Draw a line to separate the footer area
  doc.line(10, 125, 200, 125);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('MMB Complex Hostel,Trichy', 14, 135);
  doc.text('For any queries,', 14, 141);  // First line of text
doc.text('please contact the hostel administration.', 14, 146);  // Next line of text


  // === Optional Watermark ===
  // Add a subtle rotated watermark to the receipt
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(30);
  doc.text('RECEIPT', 105, 160, { align: 'center', angle: 45 });

  // === Save the PDF ===
  doc.save(`${payment.fullName}_Receipt.pdf`);
}

}
