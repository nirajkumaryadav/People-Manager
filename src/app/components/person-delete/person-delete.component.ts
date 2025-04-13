import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person';

@Component({
  selector: 'app-person-delete',
  templateUrl: './person-delete.component.html',
})
export class PersonDeleteComponent implements OnInit {
  personId: string;
  person: Person;
  loading = false;
  loadingPerson = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personId = params['id'];  
      
      if (!this.personId) {
        this.error = 'Invalid person ID';
        this.loadingPerson = false;
        return;
      }
      
      this.loadPerson();
    });
  }
  
  loadPerson() {
    this.peopleService.getPerson(this.personId)
      .subscribe(
        data => {
          this.person = data;
          this.loadingPerson = false;
        },
        error => {
          this.error = 'Person not found';
          this.loadingPerson = false;
          console.error(error);
        }
      );
  }

  onConfirmDelete() {
    this.loading = true;
    
    this.peopleService.deletePerson(this.personId)
      .subscribe(
        () => {
          this.router.navigate(['/people'], { queryParams: { deleted: true } });
        },
        error => {
          this.error = 'Error deleting person';
          this.loading = false;
          console.error(error);
        }
      );
  }

  onCancel() {
    this.router.navigate(['/people']);
  }
}
