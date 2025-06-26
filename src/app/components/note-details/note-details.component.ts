import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NoteEditorModalComponent } from '../noteeditor/note-editor.component';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [CommonModule, NoteEditorModalComponent],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note = signal<Note | null>(null);
  showEditor = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const noteId = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser();

    // ✅ Type guard: Ensure both user and noteId are present
    if (!user) {
      this.router.navigate(['/welcome']);
      return;
    }

    if (!noteId) {
      this.toastr.error('Invalid note ID');
      this.router.navigate(['/notes']);
      return;
    }

    // ✅ Now noteId is guaranteed to be a string
    const foundNote = this.noteService.getNoteById(noteId);
    if (foundNote) {
      this.note.set(foundNote);
    } else {
      this.toastr.error('Note not found');
      this.router.navigate(['/notes']);
    }
  }

  deleteNote() {
    const note = this.note();
    const user = this.auth.currentUser();

    if (!note || !user || !note.id) return;

    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(user.id, note.id);
      this.toastr.success('Note deleted');
      this.router.navigate(['/notes']);
    }
  }

  editNote() {
    this.showEditor.set(true);
  }

  saveNote(updated: Note) {
    const user = this.auth.currentUser();
    if (!user) return;

    this.noteService.addOrUpdateNote(user.id, updated);
    this.toastr.success('Note updated!');
    this.note.set(updated);
    this.showEditor.set(false);
  }

  closeModal() {
    this.showEditor.set(false);
  }

  goBack() {
    this.router.navigate(['/notes']);
  }
}
