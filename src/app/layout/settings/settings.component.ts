import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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

  constructor( private db: AngularFirestore,public dialog: MatDialog ) { }

  ngOnInit(): void {
  
  this.getBanners()
  }

  getBanners() {
    this.db.collection('banners')
      .valueChanges({ idField: 'id' })
      .subscribe(x => {
        this.banners = x;
        console.log(this.banners)
      });
}
closeNewForm() {
  // this.form_view = false;
}

  deleteBanner(id) {
    this.db.doc(`banners/${id}`).delete();
  } //Deleting Banners
  // confirmDeleteBannersDialog(row): void {
  //   const message = `Are you sure you want to delete this Addon?`;

  //   const dialogData = new ConfirmDialogModel('Confirm Action', message);

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     maxWidth: '400px',
  //     data: dialogData
  //   });

  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     if (dialogResult) {
  //       this.deleteBanner(row)
  //       // this.notifier.show("success", "<b>Driver</b> - successfully selected.");
  //     } else {
  //       // this.notifier.notify("warning", "<b>Driver</b> - not selected.");
  //     }
  //   });
  // }

}
