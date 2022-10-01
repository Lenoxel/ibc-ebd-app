import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fakeArray'
})
export class FakeArrayPipe implements PipeTransform {

  transform(quantity: number, ...args: unknown[]): number[] {
    return Array(quantity);
  }

}
