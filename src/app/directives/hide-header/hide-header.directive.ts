import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {
  @Input('appHideHeader') header: any;

  private headerHeight = 44;

  constructor(
    private renderer: Renderer2,
    private domController: DomController,
  ) { }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    if ($event.detail.scrollTop > this.headerHeight) {
      this.domController.write(() => {
        this.renderer.setStyle(this.header, 'margin-top', `-${ this.header.clientHeight }px`);
      });
    } else {
      this.domController.write(() => {
        this.renderer.setStyle(this.header, 'margin-top', '0');
      });
    }

    this.headerHeight = $event.detail.scrollTop;
  }

  ngOnInit(): void {
    this.header = this.header.el;

    this.domController.read(() => {
      this.headerHeight = this.header.clientHeight;
    });

    this.domController.write(() => {
      this.renderer.setStyle(this.header, 'transition', 'margin-top 500ms');
    });
  }
}
