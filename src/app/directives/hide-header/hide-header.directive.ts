import { AfterViewInit, Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements AfterViewInit {
  @Input('appHideHeader') header: any;

  private headerHeight = 44;

  constructor(
    private domController: DomController,
    private renderer: Renderer2,
  ) { }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    if ($event.detail.scrollTop > this.headerHeight) {
      this.domController.write(() => {
        this.renderer.setStyle(this.header, 'transform', `translateY(-${this.header.clientHeight}px)`);
      });
    } else {
      this.domController.write(() => {
        this.renderer.setStyle(this.header, 'transform', `translateY(0)`);
      });
    }

    this.headerHeight = $event.detail.scrollTop;
  }

  ngAfterViewInit(): void {
    this.header = this.header.el;

    this.domController.read(() => {
      this.headerHeight = this.header.clientHeight;
    });

    this.domController.write(() => {
      this.renderer.setStyle(this.header, 'transition', 'transform 500ms');
      this.renderer.setStyle(this.header, 'will-change', 'transform');
    });
  }
}
