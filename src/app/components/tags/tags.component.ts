import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tags: string[] = [];
  @Input() selectedTag: string | null = null;
  @Output() tagSelected = new EventEmitter<string | null>();

  onTagClick(tag: string) {
    const isSame = this.selectedTag === tag;
    this.tagSelected.emit(isSame ? null : tag);
  }
}
