import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { NewDriverComponent } from 'src/app/new-driver/new-driver.component';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource 
  constructor(private search_service:SearchService,public dialog: MatDialog,private db:AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection(`drivers`).valueChanges({idField:'id'})
    .subscribe(drivers=>{
      this.dataSource = new MatTableDataSource(drivers)
    })

    this.search_service.filter.subscribe(x=>{
      // console.log(x)
      if(x){
        if(x.target === '/drivers'){
          this.filter(x.filterValue)
        }
      }
    
    })

   

  }

  removeDriver(user_id, user_name): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title:`Confirm Deletion!`,
        message:`Are you sure want to delete ${user_name} from drivers`,
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result){
        console.log('removing driver',user_id)
      this.db.doc(`drivers/${user_id}`).delete()
      }
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open( NewDriverComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  filter(filter_value) {
    console.log(`searching for:- ${filter_value}`);
    this.dataSource.filter = filter_value.trim().toLowerCase();
  }

}
