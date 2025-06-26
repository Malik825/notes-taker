import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Note } from '../../models/note.model';

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
    private auth: AuthService ,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.noteService.loadNotes(user.id); 
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
  archive(event: Event, note: Note) {
  event.preventDefault(); // Prevent routerLink
  event.stopPropagation();

  const user = this.auth.currentUser();
  if (!user) return;

  this.noteService.archiveNote(note.id, user.id);
  this.toastr.info('Note archived!');
}

}
