// src/app/components/note-editor-modal/note-editor.component.ts
import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss']
})
export class NoteEditorModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() note: Note | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Note>();

  noteForm: FormGroup;
  defaultTags: string[] = ['Work', 'Personal', 'Ideas']; // Default tags

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      tags: [''] // Will be prefilled with default tags as a comma-separated string
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note']?.currentValue) {
      this.noteForm.patchValue({
        title: this.note?.title ?? '',
        content: this.note?.content ?? '',
        tags: this.note?.tags?.join(', ') ?? this.defaultTags.join(', ') // Prefill with default tags if no existing tags
      });
    } else if (changes['visible']?.currentValue && !this.note) {
      this.noteForm.patchValue({
        tags: this.defaultTags.join(', ') // Set default tags when opening a new note
      });
    }
  }

saveNote() {
  if (this.noteForm.invalid) return;

  const { title, content, tags } = this.noteForm.value;
  const now = new Date().toISOString();

  const note: Note = {
    id: this.note?.id || 'note_' + Math.random().toString(36).substring(2, 9),
    title,
    content,
    tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
    createdAt: this.note?.createdAt || now,
    updatedAt: now
  };

  this.save.emit(note);
  this.visibleChange.emit(false);

  // ✅ Clear form if creating new note
  if (!this.note?.id) {
    this.noteForm.reset();
  }
}


  close() {
    this.visibleChange.emit(false);
  }

  updateTags(event: Event) { // Explicitly type the event parameter
    const input = event.target as HTMLInputElement;
    const selectedTags = this.defaultTags.filter(tag => {
      const checkbox = document.querySelector(`input[value="${tag}"]`) as HTMLInputElement;
      return checkbox?.checked || false; // Safely handle null checkbox
    });
    this.noteForm.patchValue({ tags: selectedTags.join(', ') });
  }
}