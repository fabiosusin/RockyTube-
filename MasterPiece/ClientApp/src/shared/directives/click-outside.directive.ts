import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) { }

  @Output()
  clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event'])
  onClick = ($event: any) => {
    //https://stackoverflow.com/questions/50531212/directive-click-outside-angular-6
    //https://stackoverflow.com/questions/39245488/event-path-is-undefined-running-in-firefox
    //If the component uses viewEncapsulation, the target element is the component and not the clicked element
    //So, to be able to use this with encapsulation we need to look at the path
    //$event.path is Chrome specific property, another browsers will use $event.composedPath
    var path = $event.path || ($event.composedPath && $event.composedPath());
    this._elementRef.nativeElement.contains(path && path.length ? path[0] : $event.target) || this.clickOutside.emit(null);
  }
}