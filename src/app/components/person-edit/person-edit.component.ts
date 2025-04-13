import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup;
  personId: string;  
  isAddMode: boolean;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personId = params['id'];  
      this.isAddMode = !this.personId;
      
      this.personForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
      });

      if (!this.isAddMode) {
        this.loading = true;
        this.peopleService.getPerson(this.personId)
          .subscribe(
            person => {
              this.personForm.patchValue(person);
              this.loading = false;
            },
            error => {
              this.error = 'Person not found';
              this.loading = false;
              console.error(error);
            }
          );
      }
    });
  }

  get f() { return this.personForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.personForm.invalid) {
      return;
    }

    this.loading = true;
    
    if (this.isAddMode) {
      this.createPerson();
    } else {
      this.updatePerson();
    }
  }

  private createPerson() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const person = {
      ...this.personForm.value,
      id: id
    };
    
    this.peopleService.createPerson(person)
      .subscribe(
        () => {
          this.router.navigate(['/people'], { queryParams: { created: true } });
        },
        error => {
          this.error = 'Error creating person';
          this.loading = false;
          console.error(error);
        }
      );
  }

  private updatePerson() {
    const person = { ...this.personForm.value, id: this.personId };
    
    this.peopleService.updatePerson(person)
      .subscribe(
        () => {
          this.router.navigate(['/people'], { queryParams: { updated: true } });
        },
        error => {
          this.error = 'Error updating person';
          this.loading = false;
          console.error(error);
        }
      );
  }
}
