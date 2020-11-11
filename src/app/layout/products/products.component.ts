import { Component, OnInit } from '@angular/core';
import { MerchantsService } from './../../merchants.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products;
  constructor(private merchant_service:MerchantsService) { 

  }

  ngOnInit(): void {
    this.products = this.merchant_service.current_section.products

  }

  viewProduct(i){
    this.merchant_service.openProduct(i)
  }

}
