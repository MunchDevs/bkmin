import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { SearchService } from 'src/app/search.service';
import { InviteUserComponent } from '../invite-user/invite-user.component';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.css']
})
export class SystemUsersComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource 
  invitaitions_dataSource: any;
  
  constructor(private search_service:SearchService,public dialog: MatDialog,private db:AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection(`admins`).valueChanges({idField:'id'})
    .subscribe(admins=>{
      this.dataSource = new MatTableDataSource(admins)
    })
    this.db.collection(`admin_invitations`).valueChanges({idField:'id'})
    .subscribe(invitations=>{
      this.invitaitions_dataSource = new MatTableDataSource(invitations)
    })


    this.search_service.filter.subscribe(x=>{
      // console.log(x)
      if(x){
        if(x.target === '/system-users'){
          this.filter(x.filterValue)
        }
      }
    
    })
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(InviteUserComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }



  removeInvitation(user_id, user_name,type): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title:`Confirm Deletion!`,
        message:`Are you sure want to delete ${user_name} from system users`,
     }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result){
        if(type === 'invitation'){
          this.db.doc(`admin_invitations/${user_id}`).delete()
        }else{
          this.db.doc(`admins/${user_id}`).delete()
        }
        
      }
    });
  }

  toggleAdminRole(value,user_id,type){
      console.log(value)

    if(type === 'invitation'){
      this.db.doc(`admin_invitations/${user_id}`).set({super_admin:value},{merge:true})
    }else{
      this.db.doc(`admins/${user_id}`).set({super_admin:value},{merge:true})
    }
  }


  filter(filter_value) {
    console.log(`searching for:- ${filter_value}`);
    this.dataSource.filter = filter_value.trim().toLowerCase();

    this.invitaitions_dataSource.filter = filter_value.trim().toLowerCase();
  }

}
