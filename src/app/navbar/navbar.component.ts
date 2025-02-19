import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private mobileScreen = window.matchMedia('(max-width: 990px)');

  ngOnInit(): void {
    this.initializeDropdownBehavior();
    this.initializeMenuToggle();
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
