import { Component } from '@angular/core';
import { AuthService } from '../login.service';


@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
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

    this.getUsers();
  
 }



 loading: boolean = true;
error: string = '';
users: any[] = [];

constructor(private userService: AuthService) {}

getUsers(): void {
  this.userService.getAllUsers().subscribe(
    (data: any[]) => {
      this.users = data;
      this.loading = false;
    },
    (err) => {
      this.error = 'Error fetching users';
      this.loading = false;
    }
  );
}

}
