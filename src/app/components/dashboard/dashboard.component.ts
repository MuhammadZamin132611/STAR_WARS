import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StarWarsService } from 'src/app/service/star-wars.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'species', 'code'];
  dataSource = new MatTableDataSource<any>([]);
  people: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private swapiService: StarWarsService) { }

  ngOnInit(): void {
    this.swapiService.getPeople().subscribe(data => {
      this.people = data.results
      this.dataSource.data = data.results;  // Assuming data.results is an array
      this.dataSource.paginator = this.paginator;
    });
  }

}
