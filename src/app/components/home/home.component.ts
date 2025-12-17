import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MenuSection } from '../../models/menu';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {


  filteredMenuSections: MenuSection[] = [];

  constructor(private router: Router, private menuService: MenuService) {
    this.filteredMenuSections = this.menuService.getFilteredMenuSections();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
}
