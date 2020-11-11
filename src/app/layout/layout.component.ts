import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidenav_mode = 'push'
  hasBackdrop = true;
  side_nav_opened
  on_mobile_view
  search_mode = false;
  on_searchable_page = false;
  searchable_target

  constructor(private search_service:SearchService ,private router: Router,private afAuth:AngularFireAuth,private breakpointObserver: BreakpointObserver,mediaMatcher: MediaMatcher) { 
    const on_mobile_view = mediaMatcher.matchMedia('(max-width: 600px)').matches;
    this.toggleSideBarMode(on_mobile_view)
    // router.events.subscribe((url:any) => console.log(url));
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event:any) => {
          let url = event.url
          console.log(url)
          if(url === '/requests'||url === '/merchants'||url === '/customers'||url === '/drivers'||url === '/system-users'){
            this.on_searchable_page = true;
            this.searchable_target = url
          }else{
            this.on_searchable_page = false;
            this.searchable_target = '';
            this.search_mode = false
          }
          console.log(this.on_searchable_page)
      });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).subscribe(on_mobile_view => {
        this.toggleSideBarMode(on_mobile_view.matches)
    });
  }

  filter(event){
    let value = event.target.value
    let search_object = {
      target:this.searchable_target,
      filterValue:value
    }
    this.search_service.onFilter(search_object)
  }

  toggleSideBarMode(on_mobile_view){
    this.on_mobile_view = on_mobile_view
    if(on_mobile_view){
      this.sidenav_mode = 'over'
      this.hasBackdrop = true;
      this.side_nav_opened = false
      console.log('on mobile')
   }else{
      this.sidenav_mode = 'side'
      this.hasBackdrop = false;
      console.log('on web')
      this.side_nav_opened = true

   }
  }

  logout(){
     this.afAuth.signOut()
  }

}
