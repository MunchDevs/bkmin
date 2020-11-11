import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  filter:BehaviorSubject<any> = new BehaviorSubject(null)
  constructor() { }

  onFilter(search_object){
    this.filter.next(search_object)
  }
}
