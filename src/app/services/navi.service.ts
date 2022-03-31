import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NaviService {

  isCollapse: BehaviorSubject<boolean>;
  isVisible: BehaviorSubject<boolean>;
  homeworkIsVisible: BehaviorSubject<boolean>;

  constructor() {
    this.isCollapse = new BehaviorSubject<boolean>(false)
    this.isVisible = new BehaviorSubject<boolean>(true);
    this.homeworkIsVisible = new BehaviorSubject<boolean>(true);
  }

  setIsCollapsed(newValue: boolean): void {
    this.isCollapse.next(newValue);
  }

  getIsCollapsed(): Observable<boolean> {
    return this.isCollapse.asObservable()
  }

  setIsVisible(newValue: boolean): void {
    this.isVisible.next(newValue);
  }

  getIsVisible(): Observable<boolean> {
    return this.isVisible.asObservable()
  }

  getHomeworkIsVisible(): Observable<boolean> {
    return this.homeworkIsVisible.asObservable();
  }

  setHomeworkIsVisible(newValue: boolean): void {
    this.homeworkIsVisible.next(newValue)
  }
}
