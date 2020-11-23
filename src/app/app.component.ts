import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'white-label-admin';


  constructor(private af_Auth:AngularFireAuth, private router: Router, private auth_service:AuthService) {
    
  }
  ngOnInit(): void {
    this.af_Auth.authState
    .subscribe(x => {
      let that = this;
   console.log("auth state :",x)
      if (x) {
        console.log('Logged in :)');
        console.log(x)
        this.auth_service.checkAuthorisation(x,true)
       
      } else {
        console.log('Logged out :(');
        this.router.navigateByUrl('/login')
      }
    });
  }
}

