import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GithubBehaviourService {
  private selectedEntitySubject = new BehaviorSubject<any>(null); // BehaviorSubject to manage selected entity
  public selectedEntity$ = this.selectedEntitySubject.asObservable();  // Observable to subscribe to the selected entity

  constructor(private http: HttpClient) {}

  // Method to update the selected entity
  updateSelectedEntity(entity: any) {
    this.selectedEntitySubject.next(entity);  // Emit new entity
  }
}
