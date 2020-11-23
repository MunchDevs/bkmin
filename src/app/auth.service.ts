import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  current_user: BehaviorSubject<any> = new BehaviorSubject(null)
  constructor(private db: AngularFirestore,private router: Router) { }

  checkAuthorisation(user, from_call){
   
    this.db.collection(`admins`,ref=>ref.where('email','==',user.email).limit(1))
    .valueChanges({idField:'id'})
    .subscribe(admins=>{
      let from_admins = true;
        //if the user exists in admin users pass to dashboard 
        console.log("we are back")
      if(admins.length>0){
        console.log('admin found')
        this.current_user.next(admins[0])
        this.router.navigateByUrl('/dashboard')
      }else{
        console.log('admin not found')
        //if the user exists in invitaitions create the user in admins
        this.db.collection(`admin_invitations`,ref=>ref.where('email','==',user.email).limit(1))
        .valueChanges({idField:'id'})
        .subscribe(invitations=>{
             console.log('reacted')
             if(invitations.length>0){
                console.log('invitation found')
                //create user with invitation roles
                let invitation = invitations[0]
                let admin = {
                  name:user['displayName'],
                  email:invitation['email'],
                  phone:'',
                  super_admin:invitation['super_admin'],
                }

                this.db.collection(`admins`).add(admin)
                this.db.doc(`admin_invitations/${invitation.id}`).delete()
             }
             else{
               if(from_call || from_admins){
                console.log('no invitation found')
                this.router.navigateByUrl('/unauthorized')
               }
             }
            from_call = false
            from_admins = false
        })
        
      }
    })
   

    
  }
}
