import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-archived',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit {
  searchTerm = signal('');
  sortOrder = signal<'newest' | 'oldest'>('newest');

  constructor(public noteService: NoteService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user) {
      this.noteService.loadNotes(user.id);
    }
  }

  filteredArchivedNotes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const archived = this.noteService.notes().filter(n => n.archived);

    const filtered = archived.filter(note =>
      note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term)
    );

    return this.sortOrder() === 'newest'
      ? [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      : [...filtered].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  });

  restoreNote(note: Note) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;

    const updated = { ...note, archived: false };
    this.noteService.addOrUpdateNote(user.id, updated);
  }

  deleteArchivedNote(note: Note) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;

    this.noteService.deleteNote(user.id, note.id);
  }
}
