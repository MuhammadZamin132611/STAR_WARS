import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  constructor(private route: ActivatedRoute, private swapiService: StarWarsService, private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    // Retrieve personId from route parameters
    this.ngxService.start();
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
        this.ngxService.stop();
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