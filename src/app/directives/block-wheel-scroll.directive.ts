import { Directive, ElementRef, HostListener } from '@angular/core';

// Directiva que sirve para que cuando se apoye el mouse sobre un grafico y se haga zoom quede fija la pantalla
@Directive({
  selector: '[appBlockWheelScroll]',
  standalone: true,
})
export class BlockWheelScrollDirective {
  constructor(private el: ElementRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
  }
}
