import { ContentChild, Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appTabContent]",
})
export class TabContentDirective {
  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
}
