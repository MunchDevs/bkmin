import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { subscribeOn } from 'rxjs/operators';
import { Driver } from '../models/models';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.css']
})
export class AssignDriverComponent implements OnInit {
  drivers: Driver[]=[]
  request_id: any;
  constructor(
    private db:AngularFirestore,
    public dialogRef: MatDialogRef<AssignDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      console.log(data.request_id)
      this.request_id =data.request_id
    }

  ngOnInit(): void {
    this.db.collection('drivers').valueChanges({idField:'id'})
    .subscribe((d:any)=>{
       this.drivers = d;
       console.log(this.drivers)
    })
  }

  assignDriver(driver:Driver){
    this.db.doc(`requests/${this.request_id}`).set({stage:'driver_assigned',driver_name:driver.name,driver_id:driver.id,driver_reg_no:driver.reg_no},{merge:true})
    this.dialogRef.close()
  }

}
