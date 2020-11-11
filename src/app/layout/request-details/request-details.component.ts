import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Request } from 'src/app/models/models';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AssignDriverComponent } from 'src/app/assign-driver/assign-driver.component';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  order_type = 'ongoing';
  request_id;
  request:Request
  order_statuses = ['Driver Assigned','Delivery Stated','Completed']
  constructor(public dialog: MatDialog,private db:AngularFirestore, private route:ActivatedRoute) { 
    this.route.params.subscribe(p=>{
      this.request_id = p.id
    })
  }

  ngOnInit(): void {
     this.db.doc(`requests/${this.request_id}`).valueChanges()
     .subscribe(req=>{
       this.request = req as Request
     })
  }

  openDialog(): void {
 
  }

  changeStatus(status){
    this.db.doc(`requests/${this.request_id}`).set({stage:status},{merge:true})
  }

  selectDriver(){
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '250px',
      data: {request_id:this.request_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }



}
