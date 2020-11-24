import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Request } from 'src/app/models/models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AssignDriverComponent } from 'src/app/assign-driver/assign-driver.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  order_type = 'ongoing';
  request_id;
  request:Request;
  user;
  merchants_items = []
  order_statuses = ['Driver Assigned','Delivery Stated','Completed']
  constructor(private auth_service:AuthService,public dialog: MatDialog,private db:AngularFirestore, private route:ActivatedRoute,private clipboard: Clipboard) { 
    this.route.params.subscribe(p=>{
      this.request_id = p.id
    })
  }

  ngOnInit(): void {
     this.db.doc(`requests/${this.request_id}`).valueChanges()
     .subscribe(req=>{
       this.request = req as Request
       console.log(this.request)
       this.matchRequestToMechant(this.request.merchants,this.request.items)
     })

     this.auth_service.current_user.subscribe(user=>{
      this.user = user
   })
  }

  openDialog(): void {
 
  }

  matchRequestToMechant(merchants:any[],items:any[]){
    
      //create object with name and empty array for each merchant

        merchants.forEach((m:any)=>{
          let merchant = {
                          id:m.merchant_id,
                          name:m.merchant_name,
                          address:m.merchant_address,
                          contacts:m.merchan_contacts,
                          items:items.filter((x:any)=> x.merchant_id === m.merchant_id)
                         }
          if(this.merchants_items.find((x:any)=>x.id === merchant.id)){

          }else{
            this.merchants_items.push(merchant)
          }
         
        })
      //spread the arrays
      console.log(this.merchants_items)
  }

  changeStatus(stage){
    let stage_changes = this.updateStageChanges(stage)
    this.db.doc(`requests/${this.request_id}`).set({stage:stage,stage_changes:stage_changes},{merge:true})
  }

  completeRequest(request){
    let stage_changes = this.updateStageChanges('complete')
    this.db.doc(`requests/${this.request_id}`).set({stage:'complete',stage_changes:stage_changes},{merge:true});
    //release driver
    if(request.request_type === 'delivery'){
      this.db.doc(`drivers/${request.driver.id}`).set({occupied:false},{merge:true})
    }
  }

  selectDriver(){
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '450px',
      data: {request_id:this.request_id, request: this.request}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  copyRequest() {
    let text = `
     Invoice_no       : ${this.request.invoice_no}
     Customer         : ${this.request.customer_name}
     Phone No         : ${this.request.customer_phone}
     Time Of Order  : ${this.request.timestamp}
     Total                 : $${this.request.total}

     ITEMS
     ${this.merchants_items.map(mchnt => `
     Merchant : ${mchnt.name}
        items     : ${mchnt.items.map(itm => `
                  - ${itm.name} ${itm.size}  x ${itm.quantity}
                      extras : ${itm.addons.map(adn => `
                      * ${adn.name}`).join('')}
                  Preferences:
                  ${itm.preferences? itm.preferences :''}
                  Specifications:
                  ${itm.specifications? itm.specifications :''}
      `).join('')}
   `).join('')}


    `
    this.clipboard.copy(text);
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
