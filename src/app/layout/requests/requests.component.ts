import { Component, OnInit, ReflectiveKey, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Request } from '../../models/models';
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests = []//:Request[] = []
  new_requests = []//:Request[] = []
  ongoing_requests = []//:Request[] = []
  past_requests = []//:Request[] = []
  dataSource: MatTableDataSource<unknown>;
  pageSizeOptions: number[] = [];
  pageSizeCompletedOptions: number[] = [];
  pageEvent: PageEvent;
  pageSize = 10;
  displayedColumns = ['name']
  @ViewChild('paginator', { static: true })paginator: MatPaginator;
  constructor(private search_service:SearchService,private router:Router,private db:AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection(`requests`, ref=> ref.orderBy('timestamp','desc')).valueChanges({idField:'id'})
    .subscribe((x)=>{
      if(x){
        this.requests = x;
        this.new_requests = this.requests.filter(x => x.stage === 'created')
        this.ongoing_requests = this.requests.filter(x => x.stage !== 'created' && x.stage !== 'complete' )
        this.past_requests = this.requests.filter(x => x.stage === 'complete')

        this.dataSource = new MatTableDataSource(this.new_requests)

      }
      console.log(this.requests)
    })

    this.search_service.filter.subscribe(x=>{
      // console.log(x)
      if(x){
        if(x.target === '/requests'){
          this.filter(x.filterValue)
        }
      }
    
    })
  }

  viewDetails(request_id){
     this.router.navigateByUrl(`request/${request_id}`)
  }


  switchDataSource(tab_index){
    console.log(tab_index)
        switch (tab_index) {
              case 0:
                this.dataSource = new MatTableDataSource(this.new_requests)
              break;
              case 1:
                 this.dataSource = new MatTableDataSource(this.ongoing_requests)
              case 2:
                 this.dataSource = new MatTableDataSource(this.past_requests)
              break;
          
            default:
              break;
          }
          // this.dataSource.sort = this.sort
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);
  }

  filter(filter_value) {
    console.log(`searching for:- ${filter_value}`);
    this.dataSource.filter = filter_value.trim().toLowerCase();
  }



}
