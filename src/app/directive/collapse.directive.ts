import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCollapse]'
})
export class CollapseDirective {
  isShow = true;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }
  @HostListener('click', ['$event']) toggleOpen() {
    const nextEl = this.renderer.nextSibling(this.elRef.nativeElement);
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.renderer.addClass(nextEl, 'show');
    } else {
      this.renderer.removeClass(nextEl, 'show');
    }
  }
}
