import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private swapiService: StarWarsService) { }

  ngOnInit(): void {
    this.getPeople();
  }

  p: any
  itemsPerPage: number = 5;

  getPeople = () => {
    this.swapiService.getPeople().subscribe({
      next: (data: any) => {
        // console.log(data); // Inspect the data structure
        // if (Array.isArray(data.results)) {
        //   this.people = data.results;
        //   console.log(this.people)
        // } else if (Array.isArray(data)) {
        //   this.people = data;
        // } else {
        //   console.error('Unexpected data structure:', data);
        // }
        this.p = 1;
        if (Array.isArray(data.results)) {
          this.people = data.results.map(this.processCharacterData);
          this.speciesList = data.results
            .map(this.processCharacterData.bind(this))
            .filter((character: any) => character.species && character.species !== '...');
          console.log("speciesList", this.speciesList)
          this.vehiclesList = data.results
            .map(this.processCharacterData.bind(this))
            .filter((character: any) => character.vehicles && character.vehicles !== '...');
          console.log("vehiclesList", this.vehiclesList)
          this.starshipsList = data.results
            .map(this.processCharacterData.bind(this))
            .filter((character: any) => character.starships && character.starships !== '...');
          console.log("vehiclesList", this.starshipsList)
        } else if (Array.isArray(data)) {
          this.people = data.map(this.processCharacterData);
          this.speciesList = data
            .map(this.processCharacterData.bind(this))
            .filter(character => character.species && character.species !== '...');
          this.vehiclesList = data
            .map(this.processCharacterData.bind(this))
            .filter((character: any) => character.vehicles && character.vehicles !== '...');
        } else {
          console.error('Unexpected data structure:', data);
        }
      }
    });
  }

  displayValue(value: any): string {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return '...';
    }
    return value;
  }

  concatArray(arr: string[]): string {
    if (!arr || arr.length === 0) {
      return '...';
    }
    return arr.join(', ');
  }

  processCharacterData = (character: any) => {
    return {
      ...character,
      name: this.displayValue(character.name),
      height: this.displayValue(character.height),
      mass: this.displayValue(character.mass),
      hair_color: this.displayValue(character.hair_color),
      skin_color: this.displayValue(character.skin_color),
      eye_color: this.displayValue(character.eye_color),
      birth_year: this.displayValue(character.birth_year),
      gender: this.displayValue(character.gender),
      homeworld: this.displayValue(character.homeworld),
      films: this.displayValue(character.films),
      species: this.displayValue(character.species),
      vehicles: this.concatArray(character.vehicles),
      starships: this.concatArray(character.starships)
    };



  }

  details: any[] = [];
  getPeopleDetail(personId: number) {
    this.swapiService.getPersonId(personId).subscribe({
      next:(data: any) => {
        console.log('Person details:', data);
      },
      error:(error: any) => {
        console.error('Error fetching person details:', error);
      }
      
    });
  }



}
