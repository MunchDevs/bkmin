import { Component, OnInit } from '@angular/core';
import { FakeDB } from '../../models/fake_db';
import { MerchantsService } from './../../merchants.service';


@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  private db = new FakeDB()
  sections
  
  constructor(private merchant_service:MerchantsService) { 
    this.sections = this.merchant_service.current_merchant.sections
  }

  ngOnInit(): void {
    // this.sections = this.db.sections
  }

  viewProducts(idx){
    this.merchant_service.openSection(idx)
  }

}
