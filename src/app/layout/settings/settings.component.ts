import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Tier } from 'src/app/models/models';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  dataSourceBanners: any;
  banners: any;
  pass = {
    write:false,
    read:false,
    update:false,
    delete:false,
    page:'Settings'
  }
  displayedBannerColumns: string[] = ['heading1'];
  tiers: Tier;
  extra_tier: any;

  constructor(private fb:FormBuilder, private db: AngularFirestore,public dialog: MatDialog ) { }
  charges_form:FormGroup
  
  
  ngOnInit(): void {
  
  
  this.getBanners()
  this.getDeliveryCharges()
  }

  getBanners() {
    this.db.collection('banners')
      .valueChanges({ idField: 'id' })
      .subscribe(x => {
        this.banners = x;
        console.log(this.banners)
      });
  }

  getDeliveryCharges(){
    this.db.collection('charges').doc('delivery')
    .valueChanges()
    .subscribe((tiers:any)=>{
      this.tiers = tiers.delivery
      this.extra_tier =tiers.extra
    })
  }
  closeNewForm() {
    // this.form_view = false;
  }

  deleteBanner(id) {
    this.db.doc(`banners/${id}`).delete();
  } 

}
