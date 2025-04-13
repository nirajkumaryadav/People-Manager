import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  loading = true;
  error = '';

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople() {
    this.loading = true;
    this.peopleService.getPeople().subscribe(
      (data) => {
        this.people = data;
        this.loading = false;
      },
      (err) => {
        this.error = 'Error loading people. Please try again.';
        this.loading = false;
        console.error(err);
      }
    );
  }
}
