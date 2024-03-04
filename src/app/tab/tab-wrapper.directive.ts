import { ContentChild, Directive, Input } from "@angular/core";
import { TabHeaderDirective } from "./tab-header.directive";
import { TabContentDirective } from "./tab-content.directive";

@Directive({
  selector: "[appTabWrapper]",
})
export class TabWrapperDirective {
  @Input({ alias: "appTabWrapper", required: true }) id: string;
  @ContentChild(TabHeaderDirective) header!: TabHeaderDirective;
  @ContentChild(TabContentDirective) content!: TabContentDirective;
}
