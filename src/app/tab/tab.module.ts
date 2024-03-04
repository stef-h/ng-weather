import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabCollectionComponent } from "./tab-collection.component";
import { TabContentDirective } from "./tab-content.directive";
import { TabHeaderDirective } from "./tab-header.directive";
import { TabWrapperDirective } from "./tab-wrapper.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    TabCollectionComponent,
    TabHeaderDirective,
    TabContentDirective,
    TabWrapperDirective,
  ],
  exports: [
    TabCollectionComponent,
    TabHeaderDirective,
    TabContentDirective,
    TabWrapperDirective,
  ],
})
export class TabModule {}
