import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Theme, ThemeService } from '../services/theme.service';
import { NgToggleModule } from 'ng-toggle-button';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BsDropdownModule, NgToggleModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor() {
    this.theme = this.themeService.theme()
  }
  theme?: Theme
  themeService = inject(ThemeService)

}
