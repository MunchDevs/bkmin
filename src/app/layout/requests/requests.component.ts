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
  filter_start_date;
  filter_end_date;

  requests = []
  new_requests = []
  ongoing_requests = []
  past_requests = []

  new_requests_count = 0;
  ongoing_requests_count = 0;
  past_requests_count = 0;

  dataSource: MatTableDataSource<unknown>;
  pageSizeOptions: number[] = [];
  pageSizeCompletedOptions: number[] = [];
  pageEvent: PageEvent;
  pageSize = 10;
  displayedColumns = ['name']
  @ViewChild('paginator', { static: true })paginator: MatPaginator;
  constructor(private search_service:SearchService,private router:Router,private db:AngularFirestore) { }

  ngOnInit(): void {
    let start_timestamp = new Date(new Date().setHours(0,0,0,0)).getTime() / 1000
    let end_timestamp = (new Date(new Date().setHours(0,0,0,0)).getTime() / 1000) + 86400

    this.db.collection(`requests`, ref=> ref.where('timestamp', '>=', start_timestamp)
    .where('timestamp', '<=', end_timestamp)
    .orderBy('timestamp','desc')).valueChanges({idField:'id'})
    .subscribe((x)=>{
      if(x){
        this.requests = x;
        this.new_requests = this.requests.filter(x => x.stage === 'created')
        this.ongoing_requests = this.requests.filter(x => x.stage === 'accepted' || x.stage === 'driver_assigned' || x.stage === 'delivery_started'   )
        this.past_requests = this.requests.filter(x => x.stage === 'complete' || x.stage === 'cancelled')

        //counts
        this.new_requests_count = this.new_requests.length;
        this.ongoing_requests_count = this.ongoing_requests.length;
        this.past_requests_count = this.past_requests.length;

        console.log(this.ongoing_requests)
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



  getDateRangeinputEvent($event){
    console.log($event)
  }

  filterByDate(){
     if(this.filter_start_date && this.filter_end_date){
      let start_timestamp = new Date(this.filter_start_date).getTime() / 1000
      let end_timestamp = (new Date(this.filter_end_date).getTime() / 1000) + 86400

      this.db.collection(`requests`, ref=> ref.where('timestamp', '>=', start_timestamp)
      .where('timestamp', '<=', end_timestamp)
      .orderBy('timestamp','desc')).valueChanges({idField:'id'})
      .subscribe((x)=>{
        if(x){
          this.requests = x;
          this.new_requests = this.requests.filter(x => x.stage === 'created')
          this.ongoing_requests = this.requests.filter(x => x.stage === 'accepted' || x.stage === 'driver_assigned' || x.stage === 'delivery_started'   )
          this.past_requests = this.requests.filter(x => x.stage === 'complete')
  
          //counts
          this.new_requests_count = this.new_requests.length;
          this.ongoing_requests_count = this.ongoing_requests.length;
          this.past_requests_count = this.past_requests.length;
  
          console.log(this.ongoing_requests)
          this.dataSource = new MatTableDataSource(this.new_requests)
  
        }
        console.log(this.requests)
      })
  


     }else{
       console.log('invalid range')
     }

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
                 break
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
startDateSelect($event){
    console.log('start-date',$event.target.value)
    this.filter_start_date = $event.target.value
    this.filterByDate()
  }

  endDateSelect($event){
    console.log('end-date',$event.target.value)
    this.filter_end_date = $event.target.value
    this.filterByDate()
  }
  filter(filter_value) {
    console.log(`searching for:- ${filter_value}`);
    this.dataSource.filter = filter_value.trim().toLowerCase();
  }



}
