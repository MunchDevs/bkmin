import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Request } from 'src/app/models/models';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AssignDriverComponent } from 'src/app/assign-driver/assign-driver.component';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  order_type = 'ongoing';
  request_id;
  request:Request;
  merchants_items = []
  order_statuses = ['Driver Assigned','Delivery Stated','Completed']
  constructor(public dialog: MatDialog,private db:AngularFirestore, private route:ActivatedRoute,private clipboard: Clipboard) { 
    this.route.params.subscribe(p=>{
      this.request_id = p.id
    })
  }

  ngOnInit(): void {
     this.db.doc(`requests/${this.request_id}`).valueChanges()
     .subscribe(req=>{
       this.request = req as Request
      //  console.log(this.request)
       this.matchRequestToMechant(this.request.merchants,this.request.items)
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

  changeStatus(status){
    this.db.doc(`requests/${this.request_id}`).set({stage:status},{merge:true})
  }

  completeRequest(request){
    this.db.doc(`requests/${this.request_id}`).set({stage:'complete'},{merge:true});
    //release driver
    if(request.request_type === 'delivery'){
      this.db.doc(`drivers/${request.driver.id}`).set({occupied:false},{merge:true})
    }
  }

  selectDriver(){
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '450px',
      data: {request_id:this.request_id}
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
     
     ITEMS
     ${this.merchants_items.map(elmt => `
     Merchant : ${elmt.name}
        items     : ${elmt.items.map(itm => `
                  - ${itm.name} ${itm.size}  x ${itm.quantity}
                      extras : ${itm.addons.map(adn => `
                      * ${adn.name} 

               
      `).join('')}
      `).join('')}
   `).join('')}


    `
    this.clipboard.copy(text);
  }



}
