import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Merchant } from 'src/app/models/models';

@Component({
  selector: 'app-new-merchant',
  templateUrl: './new-merchant.component.html',
  styleUrls: ['./new-merchant.component.css']
})
export class NewMerchantComponent implements OnInit {

  zoom = 13
  // center: google.maps.LatLngLiteral
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'hybrid',
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   maxZoom: 15,
  //   minZoom: 8,
  // }

  res_form: FormGroup;
  
  profileForm: FormGroup;
  contactsForm: FormGroup;
  operationsForm: FormGroup;


  imageChangedEvent: any = '';
  @Output() saved: EventEmitter<boolean> = new EventEmitter()
  croppedLogo;
  logo_url
  croppedBanner: string;
  banner_url
  bannerChangedEvent: any;
  logoChangedEvent: any;
  Categories = [];
  bannerCropping: boolean = false;
  logoCropping: boolean = false;
  position;
  default_pass;
  message: any;

  bussiness_hours_form: FormGroup
  uploadPercent: any;
  downloadURL: any;
  categories=['Fast Food','Traditional Food','Baked']

  constructor(private fb: FormBuilder, private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) { }

  uploadFile(event) { 
    const file = event.target.files[0];

    //Create file path using restaurant_name underscored
    let name_array:[] = this.res_form.value.name.split(' ');
    console.log(name_array) 
    let name_joined = name_array.join("_")
    console.log(name_joined)
    const filePath = `${name_joined}/logo`;
    console.log(filePath)
    const task = this.storage.upload(filePath, file);
  }
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngOnInit(): void {


    this.initForms()

    this.db.collection('mechant_categories').valueChanges()
      .subscribe(x => {
        this.Categories = x
      })

    // navigator.geolocation.getCurrentPosition(position => {
    //   this.center = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //   }
    // })

  }



  initForms() {
    //initialize profile form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],  
      motto: [''],
      banner_url: [''],
      logo_url: [''],
      default_password:['', [Validators.required,Validators.minLength(6)]],
      commission: ['', [Validators.required]],
      categories:[[],[Validators.required]],
      about: [''],
      open:[true]
    })
  
    //initial contacts
    this.contactsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      street_address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['Zimbabwe', [Validators.required]],
      location: [''],
      lng:['', [Validators.required]],
      lat:['', [Validators.required]],
      contacts: new FormArray([
        this.fb.group({
          contact_name: ['', Validators.required],
          phone_no: ['', Validators.required]
        })
      ])
    })


    //initializing operations form
    this.bussiness_hours_form = this.fb.group({
      monday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      tuesday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      wednesday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      thursday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      friday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      saturday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      }),
      sunday: this.fb.group({
        opens: ['', [Validators.required]],
        closes: ['', [Validators.required]]
      })
    })
    
  }

  uploadLogo() { 
    const file =  this.getBlob(this.croppedLogo)//event.target.files[0];
    
    //Create file path using restaurant_name underscored
    let res_name_array:[] = this.profileForm.value.name.split(' ');
    console.log(res_name_array) 
    let res_name_joined = res_name_array.join("_")
    console.log(res_name_joined)
    const filePath = `${res_name_joined}/logo`;
    const fileRef = this.storage.ref(filePath);
    console.log(filePath)
    const task = this.storage.upload(filePath, file);

    //monitor uploading task
    //observe percentage changes
    this.uploadPercent = task.percentageChanges()

    //get the download url
 
    //get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() =>
        { 
          this.downloadURL = fileRef.getDownloadURL()
          .subscribe(x=>{
            console.log(x)
            //save logo url
            this.logo_url = x
            //trigger banner upload
            // this.uploadBanner()
            this.save()
          })
        
        })
     )
    .subscribe()
  }

  uploadBanner() { 
    const file =  this.getBlob(this.croppedBanner)//event.target.files[0];
    
    //Create file path using restaurant_name underscored
    let res_name_array:[] = this.profileForm.value.name.split(' ');
    console.log(res_name_array) 
    let res_name_joined = res_name_array.join("_")
    console.log(res_name_joined)
    const filePath = `${res_name_joined}/banner`;
    const fileRef = this.storage.ref(filePath);
    console.log(filePath)
    const task = this.storage.upload(filePath, file);

    //monitor uploading task
    //observe percentage changes
    this.uploadPercent = task.percentageChanges()

    //get the download url
 
    //get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() =>
        { 
          this.downloadURL = fileRef.getDownloadURL()
          .subscribe(x=>{
            console.log(x)
            //save banner url
            this.banner_url = x
            this.save()
          })
        
        })
     )
    .subscribe()
  }

  pushContact() {
    (<FormArray>this.contactsForm.get('contacts')).push(
      this.fb.group({
        contact_name: ['', Validators.required],
        phone_no: ['', Validators.required]
      })
    )
  }
  
  removeContact(i) {
    (<FormArray>this.contactsForm.get('contacts')).removeAt(i)
  }

  handleAddressChange(location) {
    console.log(location)
    this.position = {
      lat: location.lat(),
      lng: location.lng(),
    }
    // this.center = {
    //   lat: location.lat(),
    //   lng: location.lng(),
    // }
  }

  mapClick(location) {
    console.log(location)
    this.position = {
      lat: location.latLng.lat(),
      lng: location.latLng.lng(),
    }
  }



  submit(){
    this.uploadLogo();
  }


  save() {

    this.auth.createUserWithEmailAndPassword(this.contactsForm.value.email,this.profileForm.value.default_password).then(x=>{
        // console.log("Forms Data : ",this.profileForm.value)
        // console.log("Forms Data : ",this.contactsForm.value)
        // console.log("Forms Data : ",this.bussiness_hours_form.value)

        let merchant:Merchant = {
          name: this.profileForm.value.name,
          email:this.contactsForm.value.email, //added
          contacts: this.contactsForm.value.contacts,  //modified
          logo_url: this.logo_url,
          bussiness_hours: this.bussiness_hours_form.value,
          categories: this.profileForm.value.categories,
          location: [this.contactsForm.value.lng,this.contactsForm.value.lat],
          commission:this.profileForm.value.commission,
          about:this.profileForm.value.about,
          motto: this.profileForm.value.motto,
          city: this.contactsForm.value.city,
          country:this.contactsForm.value.country,
          tags: this.profileForm.value.categories,
          sections: [],
          banner_url:'',//this.banner_url,
          street_address: this.contactsForm.value.street_address,
          open: true,
          distance:0,
          est_delivery_time: 0,
          cdn_delivery:false,
          timestamp:new Date().getTime() / 1000
        }

       console.log(merchant)

       this.db.collection('merchants').add(merchant)

    }).catch(error=>console.log(error.message))
  
 
  }

  //Profile Validators
  get name() {
    return this.profileForm.get('name');
  }
  get default_password() {
    return this.profileForm.get('default_password');
  }

  //Contacts Validators
  get email() {
    return this.contactsForm.get('email');
  }

  get street_address() {
    return this.contactsForm.get('street_address');
  }


  get city() {
    return this.contactsForm.get('city');
  }



  show() {
    console.log(this.res_form.value)
  }


  logoChangeEvent(event: any): void {
    this.logoChangedEvent = event;
    this.logoCropping = true
  }

  bannerChangeEvent(event: any): void {
    this.bannerChangedEvent = event;
    this.bannerCropping = true
  }
  logoCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedLogo = event.base64;
    console.log(this.croppedLogo)
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
  }


  getBlob(b64Data) {
    let contentType = 'image/png';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    console.log('returning to blog')
    return blob;
}


  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
