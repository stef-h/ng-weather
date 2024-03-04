import { ContentChild, Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appTabHeader]",
})
export class TabHeaderDirective {
  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
}
