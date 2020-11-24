import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { subscribeOn } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Driver } from '../models/models';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.css']
})
export class AssignDriverComponent implements OnInit {
  drivers: Driver[]=[]
  request_id: any;
  request
  user
  constructor(
    private auth_service:AuthService,
    private db:AngularFirestore,
    public dialogRef: MatDialogRef<AssignDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      console.log(data.request_id)
      this.request_id =data.request_id
      this.request = data.request
    }

  ngOnInit(): void {
    this.db.collection('drivers',ref=> ref.where('occupied','==',false).where('active','==',true)).valueChanges({idField:'id'})
    .subscribe((d:any)=>{
       this.drivers = d;
       console.log(this.drivers)
    })

    this.auth_service.current_user.subscribe(user=>{
      this.user = user
   })
  }

  assignDriver(driver:Driver){
    let stage_changes = this.updateStageChanges('driver_assigned')
    this.db.doc(`requests/${this.request_id}`).set({stage:'driver_assigned',driver:driver,stage_changes:stage_changes},{merge:true})
    this.db.doc(`drivers/${driver.id}`).set({occupied:true},{merge:true})
    this.dialogRef.close()
  }

  updateStageChanges(stage){
    let stage_changes
    if(!this.request['stage_changes']){
        stage_changes = {
          accepted:{
            user_id:'',
            user_name:'',
            timestamp: ''
          },
          driver_assigned:{
            user_id:'',
            user_name:'',
            timestamp:''
          },
          delivery_started:{
            user_id:'',
            user_name:'',
            timestamp: ''
          },
          cancelled:{
            user_id:'',
            user_name:'',
            timestamp:''
          },
          complete:{
            user_id:'',
            user_name:'',
            timestamp:''
          }
        }
    }else{
      stage_changes = this.request['stage_changes']
    }
    stage_changes[stage] = {
      user_id:this.user.id,
      user_name:this.user.name,
      timestamp: new Date().getTime() / 1000
    }

    return stage_changes
  }



}
