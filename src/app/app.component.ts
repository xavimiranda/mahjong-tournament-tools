import { Component, inject, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlsComponent } from './seating/controls/controls.component';
import { RoundsComponent } from './seating/rounds/rounds.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ThemeService } from './services/theme.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ControlsComponent, RoundsComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private renderer = inject(Renderer2);
  private themeService = inject(ThemeService);
  constructor(){
    toObservable(this.themeService.theme).subscribe({
      next: (theme) => this.renderer.setAttribute(document.body, 'data-bs-theme', theme),
    });
  }
}
