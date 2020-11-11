import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { MatTableDataSource } from '@angular/material/table';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource 
  constructor(private search_service:SearchService, private db:AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection(`users`).valueChanges({idField:'id'})
    .subscribe(users=>{
      this.dataSource = new MatTableDataSource(users)
    })

    this.search_service.filter.subscribe(x=>{
      // console.log(x)
      if(x){
        if(x.target === '/customers'){
          this.filter(x.filterValue)
        }
      }
    
    })
  }

  filter(filter_value) {
    console.log(`searching for:- ${filter_value}`);
    this.dataSource.filter = filter_value.trim().toLowerCase();
  }

}
