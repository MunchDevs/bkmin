import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { FakeDB } from '../../models/fake_db';
import { NewSectionComponent } from '../new-section/new-section.component';
import { MerchantsService } from './../../merchants.service';


@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  private db = new FakeDB()
  sections
  merchant_name
  
  constructor(public dialog: MatDialog,private merchant_service:MerchantsService) { 
    this.sections = this.merchant_service.current_merchant.sections
    this.merchant_name = this.merchant_service.current_merchant.name
  }

  ngOnInit(): void {
    // this.sections = this.db.sections
  }


  viewProducts(idx){
    this.merchant_service.openSection(idx)
  }


  removeSection(i, name): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title:`Confirm Deletion!`,
        message:`Are you sure want to delete ${name} from section`,
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result){
        this.merchant_service.removeSection(i)
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open( NewSectionComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
