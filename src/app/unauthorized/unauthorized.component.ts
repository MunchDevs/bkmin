import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private afAuth:AngularFireAuth,) { }

  ngOnInit(): void {
  }
  logout(){
    this.afAuth.signOut()
  }

}
