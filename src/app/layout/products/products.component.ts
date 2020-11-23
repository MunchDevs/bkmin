import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from 'src/app/models/models';
import { MerchantsService } from './../../merchants.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products:Product[];
  merchant_name  = this.merchant_service.current_merchant.name
  section_name = this.merchant_service.current_section.name
  constructor(private merchant_service:MerchantsService, private db:AngularFirestore) { 

  }

  ngOnInit(): void {
    this.products = this.merchant_service.current_section.products
   
    console.log(this.products)
  }

  viewProduct(i){
    this.merchant_service.openProduct(i)
  }

  toggleAvailability(i,checked){
    this.products[i].available = checked
    this.db.doc(`merchants/${this.merchant_service.current_merchant['id']}`).set(this.merchant_service.current_merchant,{merge:true})
  }

}
