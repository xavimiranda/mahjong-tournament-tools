import { Component, inject, input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgFor, NgForOf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SeatingService } from '../../seating.service';

@Component({
  selector: 'app-groups',
  standalone: true,

  imports: [FormsModule, TypeaheadModule, NgFor, NgForOf, TitleCasePipe],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  currentSelection: string[] = [];

  seatingService = inject(SeatingService);
  group = input.required<'avoid' | 'forbid'>();

  onPreview(event: TypeaheadMatch<any>) {}

  onSelect(event: TypeaheadMatch<any>, groupNumber: number) {
    this.seatingService.addPlayerToGroup(this.group(), event.value, groupNumber);
    this.clearSelection(groupNumber);
  }

  onBlur(event: TypeaheadMatch<any> | undefined, groupNumber: number) {
    this.clearSelection(groupNumber);
  }

  addGroup() {
    this.seatingService.addGroup(this.group());
    this.currentSelection.push('');
  }

  removeNameFromGroup(groupNumber: number, name: string) {
    this.seatingService.removePlayerFromGroup(this.group(), groupNumber, name);
  }

  clearSelection(groupNumber: number) {
    this.currentSelection[groupNumber] = '';
  }

  removeGroup(groupNumber: number) {
    this.seatingService.removeGroup(this.group(), groupNumber);
  }
}
