import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss']
})
export class NotesDashboardComponent implements OnInit {
  constructor(
    public noteService: NoteService,
    private auth: AuthService // ✅ Need to get user ID
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.noteService.loadNotes(user.id); // ✅ Ensure notes load after refresh
    }
  }

  get notes() {
    return this.noteService.notes;
  }

  get filteredNotes() {
    return this.noteService.filteredNotes;
  }

  get searchTerm() {
    return this.noteService.searchTerm;
  }

  get sortOrder() {
    return this.noteService.sortOrder;
  }

  changeSort(order: 'latest' | 'oldest') {
    this.noteService.sortOrder.set(order);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.noteService.searchTerm.set(value);
  }
}
