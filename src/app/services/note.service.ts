// src/app/services/note.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Note } from '../models/note.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class NoteService {
  // Reactive signals
  notes = signal<Note[]>([]);
  noteToEdit = signal<Note | null>(null);
  searchTerm = signal('');
  selectedTag = signal<string | null>(null);
  sortOrder = signal<'latest' | 'oldest'>('latest');

  constructor(private storage: StorageService) {}

  // Load notes from storage
  loadNotes(userId: string) {
    const data = this.storage.get(`notes_${userId}`);
    this.notes.set(data ? JSON.parse(data) : []);
  }

  // Save notes to storage
  saveNotes(userId: string) {
    this.storage.set(`notes_${userId}`, JSON.stringify(this.notes()));
  }

  // Add or update note
  addOrUpdateNote(userId: string, note: Note): void {
    const now = new Date().toISOString();
    const updated = {
      ...note,
      id: note.id || 'note_' + Math.random().toString(36).substring(2, 9),
      createdAt: note.createdAt || now,
      updatedAt: now,
      tags: note.tags || []
    };

    const current = this.notes();
    const index = current.findIndex(n => n.id === note.id);

    if (index !== -1) {
      current[index] = updated;
    } else {
      current.unshift(updated);
    }

    this.notes.set([...current]);
    this.saveNotes(userId);
  }

  // Delete a note
  deleteNote(userId: string, noteId: string): void {
    const filtered = this.notes().filter(note => note.id !== noteId);
    this.notes.set(filtered);
    this.saveNotes(userId);
  }

  // Get a single note
  getNoteById(noteId: string): Note | undefined {
    return this.notes().find(note => note.id === noteId);
  }

  // Tag helpers
  getAllTags(): string[] {
    const allTags = this.notes()
      .flatMap(note => note.tags)
      .filter((tag): tag is string => !!tag);
    const defaultTags = ['Work', 'Personal', 'Ideas', 'Research', 'Other'];
    return [...new Set([...allTags, ...defaultTags])];
  }

  // Signals for editing
  setNoteToEdit(note: Note) {
    this.noteToEdit.set(note);
  }

  clearNoteToEdit() {
    this.noteToEdit.set(null);
  }

  // Filtered notes
  filteredNotes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tag = this.selectedTag();
    const sorted = [...this.notes()].sort((a, b) => {
      const aTime = new Date(a.updatedAt ?? 0).getTime();
      const bTime = new Date(b.updatedAt ?? 0).getTime();
      return this.sortOrder() === 'latest' ? bTime - aTime : aTime - bTime;
    });

    return sorted.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term);
      const matchesTag = tag ? note.tags?.includes(tag) : true;
      return matchesSearch && matchesTag;
    });
  });
}
