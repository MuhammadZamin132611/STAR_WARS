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
  speciesDropDown: boolean = false;
  vehiclesDropDown: boolean = false;
  starShipsDropDown: boolean = false;
  newNextedSpecies: any[] = []
  newNextedVehicles: any[] = []
  newNextedStarships: any[] = []

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
  openSpecies() {
    this.speciesDropDown = !this.speciesDropDown;
  }
  openVehicles() {
    this.vehiclesDropDown = !this.vehiclesDropDown;
  }
  openStartShips() {
    this.starShipsDropDown = !this.starShipsDropDown;
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


        } else {
          console.error('Unexpected data structure:', data);
        }

        this.people.forEach((person) => {
          if (person.species) {
            this.swapiService.getResourceByUrl(person.species).subscribe((species) => {
              person.species = species.map((species: any) => species.name);
              this.newNextedSpecies.push(...person.species);
              console.log(this.newNextedSpecies)
            });
          }
        });

        this.people.forEach((person) => {
          if (person.vehicles) {
            this.swapiService.getResourceByUrl(person.vehicles).subscribe((vehicles) => {
              person.vehicles = vehicles.map((vehicles: any) => vehicles.name);
              this.newNextedVehicles.push(...person.vehicles);
              console.log(this.newNextedVehicles)
            });
          }
        });

        this.people.forEach((person) => {
          if (person.starships.length > 0) {
            this.swapiService.getResourceByUrl(person.starships).subscribe((starships: any[]) => {
              person.starships = starships.map((starship: any) => starship.name);
              const validStarships = person.starships.filter((starship: string) => starship.trim() !== '');
              this.newNextedStarships.push(...validStarships);
            }, error => {
              console.error('Error fetching starships for', person.name, ':', error);
            });
          }
        });
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
