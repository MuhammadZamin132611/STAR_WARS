import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StarWarsService } from 'src/app/service/star-wars.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  people: any[] = [];
  speciesList: any[] = [];
  vehiclesList: any[] = [];
  starshipsList: any[] = [];
  filteredPeople: any[] = [];
  filters: any = {
    name: [],
    species: [],
    vehicles: [],
    starships: [],
    birth_year: []
  };
  itemsPerPage = 5;
  p = 1;
  moviedropDown: boolean = false;
  birthDropDown: boolean = false;

  constructor(private swapiService: StarWarsService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getPeople();
    this.ngxService.start();
  }
  openMoviveName() {
    this.moviedropDown = !this.moviedropDown;
  }
  openBirthYear() {
    this.birthDropDown = !this.birthDropDown;
  }

  getPeople(): void {
    this.swapiService.getPeople().subscribe({
      next: (data: any) => {
        this.ngxService.stop();
        if (Array.isArray(data.results)) {
          this.people = data.results.map((person: any) => ({
            ...person,
            id: person.url.split('/').filter(Boolean).pop()
          }));
          this.filteredPeople = this.people;
          this.speciesList = this.people.filter(person => person.species && person.species !== '...');
          this.vehiclesList = this.people.filter(person => person.vehicles && person.vehicles !== '...');
          this.starshipsList = this.people.filter(person => person.starships && person.starships !== '...');
          console.log('ngOninit', data)

        } else {
          console.error('Unexpected data structure:', data);
        }
      }
    });
  }

  processCharacterData(value: any): any {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return '...';
    }
    return value;
  }

  onFilterChange(type: string, event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.filters[type].push(value);
    } else {
      const index = this.filters[type].indexOf(value);
      if (index > -1) {
        this.filters[type].splice(index, 1);
      }
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPeople = this.people.filter(person => {
      const nameMatch = !this.filters.name.length || this.filters.name.includes(person.name);
      const speciesMatch = !this.filters.species.length || this.filters.species.includes(person.species);
      const vehiclesMatch = !this.filters.vehicles.length || this.filters.vehicles.includes(person.vehicles);
      const starshipsMatch = !this.filters.starships.length || this.filters.starships.includes(person.starships);
      const birthYearMatch = !this.filters.birth_year.length || this.filters.birth_year.includes(person.birth_year);

      return nameMatch && speciesMatch && vehiclesMatch && starshipsMatch && birthYearMatch;
    });
    this.p = 1;
  }
}
