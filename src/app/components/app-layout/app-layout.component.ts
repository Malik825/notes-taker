import { Component, signal, effect, computed, OnDestroy } from '@angular/core';
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
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NoteEditorModalComponent, TagsComponent, UserMenuComponent, ThemeSwitcherComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnDestroy {
  // Signals for reactive state
  showEditor = signal(false);
  selectedNote = signal<Note | null>(null);
  tags = signal<string[]>([]);
  selectedTag = signal<string | null>(null);
  sidebarCollapsed = signal(false); // Controlled by toggleSidebar
  notes = signal<Note[]>([]);
  sortOrder = signal<'latest' | 'oldest'>('latest');
  showMenu = signal(false);
  currentRoute = signal<string>('');

  // Computed properties to reduce redundant calculations
  isMobile = computed(() => window.innerWidth <= 991); // Cache mobile check
  user = computed(() => this.auth.currentUser()); // Cache user state

  private routerSubscription: Subscription | undefined;

  constructor(
    private auth: AuthService,
    private noteService: NoteService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Load tags once and cache
    this.loadTags();

    // Optimize router subscription with cleanup
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof ActivationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.snapshot.routeConfig?.path || '');
      console.log('[Route Change] Current route:', this.currentRoute());
    });

    // Effect to react to tag changes (optional optimization)
    effect(() => {
      const currentTag = this.selectedTag();
      console.log('[Effect] Selected tag changed:', currentTag);
      // Additional logic if needed
    }, { allowSignalWrites: false }); // Prevent signal writes in effect
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      console.log('[Destroy] Router subscription cleaned up');
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(value => {
      const newValue = !value;
      console.log('[ToggleSidebar] Sidebar collapsed:', newValue, 'Screen size:', this.isMobile());
      return newValue;
    });
  }

  loadTags() {
    const cachedTags = this.noteService.getAllTags(); // Assume this is memoized in NoteService
    console.log('[Tags] Loaded:', cachedTags);
    this.tags.set(cachedTags);
  }

  onTagClick(tag: string | null) {
    this.selectedTag.set(tag === this.selectedTag() ? null : tag);
  }

  changeSort(order: 'latest' | 'oldest') {
    this.sortOrder.set(order);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/welcome']);
    console.log('[Logout] User logged out');
  }

  onNewNote(event: Event) {
    event.preventDefault();
    this.showEditor.set(true);
    this.noteService.clearNoteToEdit();
    console.log('[New Note] Editor opened');
  }

  onSaveNote(note: Note) {
    const user = this.user();
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

  onMyNotesClick(event: Event) {
    if (this.isMobile()) {
      this.sidebarCollapsed.set(true);
      console.log('[My Notes] Sidebar collapsed on mobile, screen size:', window.innerWidth);
    }
    // Prevent default navigation if needed (e.g., if href is used instead of routerLink)
    event.preventDefault();
  }
}