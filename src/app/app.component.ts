import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlsComponent } from "./seating/controls/controls.component";
import { RoundsComponent } from "./seating/rounds/rounds.component";
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ControlsComponent, RoundsComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
