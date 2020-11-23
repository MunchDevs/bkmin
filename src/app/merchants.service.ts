import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FakeDB } from './models/fake_db';
import { Merchant } from './models/models';




@Injectable({
  providedIn: 'root'
})
export class MerchantsService {
  // private db = new FakeDB();
  
  db_merchants:BehaviorSubject<any[]> = new BehaviorSubject(null)
  merchants:any[];
  current_merchant:Merchant;


  current_section;
  current_section_index;

  current_product;
  current_product_index

  constructor(private router:Router, private db:AngularFirestore) {
    // this.db.collection(`merchants`).valueChanges({idField:'id'})
    // .subscribe(m => {
    //   console.log(m)
    //   this.merchants = m
    // })
    this.initMerchants()

  }

  initMerchants(){
    this.db.collection(`merchants`).valueChanges({idField:'id'})
    .subscribe(m => {
      console.log(m)
      this.merchants = m;
      this.db_merchants.next(m)
    })
  }



  openMerchant(id){

     let idx = this.merchants.findIndex(x=>x.id === id)
     if(idx > -1){
      this.current_merchant = this.merchants[idx]
      this.router.navigateByUrl(`merchants/${this.current_merchant['id']}/sections`)
     }

  }

  openEditMerchant(id){

    let idx = this.merchants.findIndex(x=>x.id === id)
    if(idx > -1){
     this.current_merchant = this.merchants[idx]
     this.router.navigateByUrl(`merchants/${this.current_merchant['id']}`)
    }

 }

  openSection(idx){
      this.current_section_index = idx
      this.current_section = this.current_merchant.sections[idx]
      this.router.navigateByUrl(`merchants/${this.current_merchant['id']}/sections/${idx}/products`)
  }

  openProduct(idx){
      this.current_product_index  = idx
      this.current_product = this.current_section.products[idx]
      this.router.navigateByUrl(`products/${idx}`)
  }

  removeSection(idx){
      this.current_merchant.sections.splice(idx,1)
      this.db.doc(`merchants/${this.current_merchant['id']}`).set(this.current_merchant,{merge:true})
  }

  
}
