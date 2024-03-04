import {
  AfterContentChecked,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from "@angular/core";
import { TabWrapperDirective } from "./tab-wrapper.directive";

@Component({
  selector: "app-tab-collection",
  templateUrl: "./tab-collection.component.html",
})
export class TabCollectionComponent implements AfterContentChecked {
  /**
   * Emits the id of the tab that should be closed
   */
  @Output() close = new EventEmitter<string>();

  @ContentChildren(TabWrapperDirective)
  tabs!: QueryList<TabWrapperDirective>;

  selectedTab: TabWrapperDirective | undefined;

  ngAfterContentChecked() {
    if (this.tabs.length === 0) {
      this.selectedTab = undefined;
    } else if (this.selectedTab === undefined) {
      this.selectedTab = this.tabs.first;
    }
  }

  closeTab(tab: TabWrapperDirective) {
    if (this.selectedTab === tab) {
      this.selectedTab = undefined;
    }

    this.close.emit(tab.id);
  }
}
