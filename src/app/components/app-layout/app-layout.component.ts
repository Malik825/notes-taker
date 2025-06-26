import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule, ActivationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';
import { ToastrService } from 'ngx-toastr';
import { NoteEditorModalComponent } from '../noteeditor/note-editor.component';
import { TagsComponent } from '../tags/tags.component';
import { UserMenuComponent } from '../usermenu/user-menu.component';
import { ThemeSwitcherComponent } from '../themeswitcher/theme-switcher.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NoteEditorModalComponent, TagsComponent, UserMenuComponent, ThemeSwitcherComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  showEditor = signal(false);
  selectedNote = signal<Note | null>(null);
  tags = signal<string[]>([]);
  selectedTag = signal<string | null>(null);
  sidebarCollapsed = signal(false); // Start uncollapsed for desktop, toggled on mobile

  notes = signal<Note[]>([]);
  sortOrder = signal<'latest' | 'oldest'>('latest');
  searchTerm: any;
  showMenu = signal(false);
  currentRoute = signal<string>(''); // Track the current route

  constructor(
    private auth: AuthService,
    private noteService: NoteService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loadTags();
    this.searchTerm = this.noteService.searchTerm;

    // Listen to route changes to update currentRoute
    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.snapshot.routeConfig?.path || '');
      console.log('[Route Change] Current route:', this.currentRoute());
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(value => {
      const newValue = !value;
      console.log('[ToggleSidebar] Sidebar collapsed:', newValue, 'Screen size:', window.innerWidth);
      return newValue;
    });
  }

  loadTags() {
    const allTags = this.noteService.getAllTags();
    console.log('[Tags] Loaded:', allTags);
    this.tags.set(allTags);
  }

  onTagClick(tag: string | null) {
    const current = this.noteService.selectedTag();
    this.noteService.selectedTag.set(current === tag ? null : tag);
  }

  changeSort(order: 'latest' | 'oldest') {
    this.noteService.sortOrder.set(order);
  }

  user() {
    return this.auth.currentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/welcome']);
    console.log('[Logout] User logged out');
  }

  onNewNote(event: Event) {
    event.preventDefault();
    // Collapse sidebar only on mobile view (≤ 991px)
    if (window.innerWidth <= 991) {
      this.sidebarCollapsed.set(true);
      console.log('[New Note] Sidebar collapsed on mobile, screen size:', window.innerWidth);
    }
    this.showEditor.set(true);
    this.noteService.clearNoteToEdit();
    console.log('[New Note] Editor opened');
  }

  onSaveNote(note: Note) {
    const user = this.auth.currentUser();
    if (!user) return;

    this.noteService.addOrUpdateNote(user.id, note);
    this.toastr.success('Note saved!');
    this.noteService.clearNoteToEdit();
    this.showEditor.set(false);
    console.log('[Save Note] Note saved:', note);
  }

  onModalClose(visible: boolean) {
    this.noteService.clearNoteToEdit();
    this.showEditor.set(false);
    console.log('[Modal] Closed');
  }

  toggleDropdown() {
    this.showMenu.update(value => !value);
  }
}