import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  form:FormGroup


  constructor(private fb:FormBuilder,private db:AngularFirestore,
    public dialogRef: MatDialogRef<InviteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
   this.form = this.fb.group({
     email:['',[Validators.required,Validators.email]],
     super_admin:[false]
   })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  invite(){
    console.log(this.form.value)
    this.db.doc(`admin_invitations/${this.form.value.email}`).set(this.form.value)
    this.dialogRef.close();

  }


}
