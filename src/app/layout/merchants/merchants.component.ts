import { Component, OnInit } from '@angular/core';
// import { FakeDB } from '../../models/fake_db';
import { MerchantsService } from './../../merchants.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  // private db = new FakeDB();
  merchants = []//this.db.merchants


  constructor(private merchant_service: MerchantsService) {
  }

  ngOnInit(): void {
    this.merchant_service.db_merchants.subscribe(m => {
      if (m) {
        this.merchants = m
        console.log(m)
      }

    })
    console.log(this.merchants)
  }

  viewSections(id) {
    this.merchant_service.openMerchant(id)
  }

  viewEdit(id) {
    this.merchant_service.openEditMerchant(id)
  }

}
