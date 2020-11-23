import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-new-driver',
  templateUrl: './new-driver.component.html',
  styleUrls: ['./new-driver.component.css']
})
export class NewDriverComponent implements OnInit {

  form:FormGroup


  constructor(private fb:FormBuilder,private db:AngularFirestore,
    public dialogRef: MatDialogRef<NewDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
   this.form = this.fb.group({
     name:['',[Validators.required]],
     id_number:['',[Validators.required]],
     phone_number:['',[Validators.required]],
     license_number:['',[Validators.required]],
     vehicle_reg:['',[Validators.required]],
     email:['',[Validators.required]],
     active:[false],
     occupied:[false]
   })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    console.log(this.form.value)
    this.db.collection(`drivers`).add(this.form.value)
    this.dialogRef.close();

  }

}
