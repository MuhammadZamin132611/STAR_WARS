import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from 'src/app/service/star-wars.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  personId: number = 0;
  personDetails: any; // Adjust the type as per your API response structure
  planetNumber!: number;
  constructor(private route: ActivatedRoute, private swapiService: StarWarsService) { }

  ngOnInit(): void {
    // Retrieve personId from route parameters
    this.route.params.subscribe(params => {
      this.personId = +params['id']; // Convert id to number (assuming it's a number)
      if (this.personId) {
        this.getPersonDetails(this.personId);
      }
    });
  }

  getPersonDetails(id: number): void {
    this.swapiService.getPersonId(id).subscribe({
      next:(data: any) => {
        this.personDetails = data;
        console.log('Person details:', this.personDetails);

        const urlParts = data.homeworld.split('/');
        this.planetNumber = urlParts[urlParts.length - 2];
      },error:(error: any) => {
        console.error('Error fetching person details:', error);
      }
    });
  }
}