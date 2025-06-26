import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';

interface UserSettings {
  username: string;
  email: string;
  defaultEditor: string;
  fontSize: number;
  autoSave: boolean;
  notifications: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    username: '',
    email: '',
    defaultEditor: 'rich-text',
    fontSize: 16,
    autoSave: true,
    notifications: true
  };

  newPassword = '';
  isUpdating = signal(false);
  isSaving = signal(false);
  isExporting = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadSettings();
  }

  totalNotes = () => this.noteService.notes().length;

  storageUsed = () => {
    const data = JSON.stringify(this.noteService.notes());
    const bytes = new Blob([data]).size;
    return bytes < 1024 ? `${bytes} B` : 
           bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` :
           `${(bytes / 1048576).toFixed(1)} MB`;
  };

  messageIcon = () => {
    switch (this.messageType()) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      default: return 'fa-info-circle';
    }
  };

  loadSettings() {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    localStorage.setItem('user_settings', JSON.stringify(this.settings));
  }

  updateAccount() {
    if (!this.settings.username || !this.settings.email) {
      this.showMessage('Please fill in all required fields', 'error');
      return;
    }

    this.isUpdating.set(true);

    setTimeout(() => {
      this.saveSettings();
      this.newPassword = '';
      this.isUpdating.set(false);
      this.showMessage('Account updated successfully!', 'success');
    }, 1000);
  }

  savePreferences() {
    this.isSaving.set(true);

    setTimeout(() => {
      this.saveSettings();
      this.isSaving.set(false);
      this.showMessage('Preferences saved successfully!', 'success');
    }, 500);
  }

  exportData() {
    this.isExporting.set(true);

    setTimeout(() => {
      const exportData = {
        notes: this.noteService.notes(),
        settings: this.settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `noteapp-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.isExporting.set(false);
      this.showMessage('Data exported successfully!', 'success');
    }, 1000);
  }

  importData() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);

        if (importData.notes && Array.isArray(importData.notes)) {
          const userId = 'current_user'; // Replace as needed
          importData.notes.forEach((note: any) => {
            this.noteService.addOrUpdateNote(userId, note);
          });

          if (importData.settings) {
            this.settings = { ...this.settings, ...importData.settings };
            this.saveSettings();
          }

          this.showMessage(`Successfully imported ${importData.notes.length} notes!`, 'success');
        } else {
          this.showMessage('Invalid backup file format', 'error');
        }
      } catch {
        this.showMessage('Error reading backup file', 'error');
      }
    };

    reader.readAsText(file);
  }

  confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your notes will be permanently deleted.')) {
      this.deleteAccount();
    }
  }

  deleteAccount() {
    localStorage.clear();
    this.noteService.notes.set([]);
    this.showMessage('Account deleted successfully', 'info');

    this.settings = {
      username: '',
      email: '',
      defaultEditor: 'rich-text',
      fontSize: 16,
      autoSave: true,
      notifications: true
    };
  }

  showMessage(text: string, type: 'success' | 'error' | 'info') {
    this.message.set(text);
    this.messageType.set(type);
    setTimeout(() => this.message.set(''), 5000);
  }
}
