import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  filter_start_date;
  filter_end_date;

  total_count;
  completed_count;
  cancelled_count;
  hanging_count;

  constructor(private db:AngularFirestore) { }

  ngOnInit(): void {
    this.getTodaysCounts()
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

  getDateRangeinputEvent($event){
    console.log($event)
  }

  filterByDate(){
     if(this.filter_start_date && this.filter_end_date){
       let start_timestamp = new Date(this.filter_start_date).getTime() / 1000
       let end_timestamp = (new Date(this.filter_end_date).getTime() / 1000) + 86400
       console.log(`range: ${start_timestamp}  - ${end_timestamp}`)

       //query all requests
       this.db.collection('requests', (ref) =>ref.where('timestamp', '>=', start_timestamp)
                                               .where('timestamp', '<=', end_timestamp))
       .valueChanges()
       .subscribe(x=>{
         //seperate orders and count them
         this.total_count = x.length;
         this.completed_count = x.filter(x=>x['stage']==='complete').length
         this.cancelled_count = x.filter(x=>x['stage']==='cancelled').length
         this.hanging_count = x.filter(x=>x['stage']!=='completed' && x['stage']!=='cancelled' ).length
       })


     }else{
       console.log('invalid range')
     }

  }

  getTodaysCounts(){
    
    let start_timestamp = new Date(new Date().setHours(0,0,0,0)).getTime() / 1000
    let end_timestamp = (new Date(new Date().setHours(0,0,0,0)).getTime() / 1000) + 86400
    console.log(`range: ${start_timestamp}  - ${end_timestamp}`)

    //query all requests
    this.db.collection('requests', (ref) =>ref.where('timestamp', '>=', start_timestamp)
                                            .where('timestamp', '<=', end_timestamp))
    .valueChanges()
    .subscribe(x=>{
      //seperate orders and count them
      this.total_count = x.length;
      this.completed_count = x.filter(x=>x['stage']==='complete').length
      this.cancelled_count = x.filter(x=>x['stage']==='cancelled').length
      this.hanging_count = x.filter(x=>x['stage']!=='completed' && x['stage']!=='cancelled' ).length
    })
  }

}
