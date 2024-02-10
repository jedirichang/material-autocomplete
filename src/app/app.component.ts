import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('autocompleteElem') autocomplete: MatAutocomplete;
  title = 'autocomplete';
  optionStore: string[] = [];
  options: string[] = [];
  readonly RELOAD_TOP_SCROLL_POSITION = 0;
  loadingData = false;
  text: string;

  ngOnInit() {
    const mockOptions = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const randomOptions = [];

    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * mockOptions.length);
      randomOptions.push(mockOptions[randomIndex]);
    }

    this.optionStore = randomOptions;
    this.options = this.optionStore.slice(0, 10);
  }

  ngAfterViewInit() {
    this.setupScrollListener();
  }

  setupScrollListener(): void {
    this.autocomplete.opened.subscribe(() => this.registerPanelScrollEvent());
  }

  registerPanelScrollEvent(): void {
    setTimeout(() => {
      const panel = this.autocomplete.panel;
      //Remove any listener that might have been added before
      panel.nativeElement.removeEventListener('scroll', (event: any) =>
        this.onScroll(event)
      );
      if (panel) {
        panel.nativeElement.addEventListener('scroll', (event: any) =>
          this.onScroll(event)
        );
      }
    }, 0);
  }

  filterData(event: string): void {
    const filterValue = event.toLowerCase();
    this.options = this.optionStore.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onScroll(event: any): void {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight - this.RELOAD_TOP_SCROLL_POSITION &&
      !this.loadingData
    ) {
      this.loadingData = true;
      console.log('true');
      setTimeout(() => {
        const currentLength = this.options.length;
        const newOptions = this.optionStore.slice(
          currentLength,
          currentLength + 10
        );
        this.options = this.options.concat(newOptions);

        this.loadingData = false;
      }, 3000);
    }
  }
}
