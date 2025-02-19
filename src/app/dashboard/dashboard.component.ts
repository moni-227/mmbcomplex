import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login.service';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend, TimeScale, ScatterController } from 'chart.js';  
import 'chartjs-adapter-date-fns';  

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend, TimeScale, ScatterController); 

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private mobileScreen = window.matchMedia('(max-width: 990px)');

  bookingsData: any = [];
  paymentsData: any = [];
  chart: any;
  rentAndAdvanceChart: any;
  rentAndAdvanceData: any[] = []; 

  constructor(private dashboardService: AuthService) {}

  ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.bookingsData = data.bookingsData;
      this.paymentsData = data.paymentsData;
      this.createChart();
    });
    this.fetchRentAndAdvanceData();
  }

  private filterDataByMonth(data: any[], dateField: string): any[] {
    const now = new Date();
    const currentMonth = now.getMonth(); // Get current month (0-based index)
    const currentYear = now.getFullYear();

    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();

      // Filter data for current and previous month
      return itemYear === currentYear && (itemMonth === currentMonth || itemMonth === currentMonth - 1);
    });
  }

  createChart() {
    // Filter bookings and payments data for the current and previous month
    const filteredBookings = this.filterDataByMonth(this.bookingsData, '_id');
    const filteredPayments = this.filterDataByMonth(this.paymentsData, '_id');

    const dates = filteredBookings.map((item: any) => item._id);
    const totalBookings = filteredBookings.map((item: any) => item.totalBookings);
    const totalPayments = filteredPayments.map((item: any) => item.totalPayments);

    this.chart = new Chart('dashboardChart', {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Total Bookings',
            data: totalBookings,
            borderColor: 'blue',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Total Payments',
            data: totalPayments,
            borderColor: 'green',
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Dates',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount / Count',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Hostel Bookings and Payments Overview',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const label = context.dataset.label || '';
                return `${label}: ${context.raw}`;
              },
            },
          },
        },
      },
    });
  }

  fetchRentAndAdvanceData(): void {
    this.dashboardService.getRentAndAdvanceData().subscribe((data) => {
      this.rentAndAdvanceData = data.rentAndAdvanceData;
      this.plotChart();
    });
  }

  plotChart(): void {
    // Filter rent and advance data for the current and previous month
    const filteredRentAndAdvanceData = this.filterDataByMonth(this.rentAndAdvanceData, '_id');
    
    const labels = filteredRentAndAdvanceData.map((data) => data._id);
    const rentData = filteredRentAndAdvanceData.map((data) => data.totalRent);
    const advanceData = filteredRentAndAdvanceData.map((data) => data.totalAdvance);

    const ctx = document.getElementById('rentAndAdvanceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Rent',
            data: rentData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Total Advance',
            data: advanceData,
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Rent and Advance Data Over Time',
            padding: {
              top: 10,
              bottom: 30,
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              tooltipFormat: 'll'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount'
            }
          }
        }
      }
    });
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
}
