import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MerchantsService } from 'src/app/merchants.service';
import { Merchant } from 'src/app/models/models';

@Component({
  selector: 'app-edit-merchant',
  templateUrl: './edit-merchant.component.html',
  styleUrls: ['./edit-merchant.component.css']
})
export class EditMerchantComponent implements OnInit {

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


  imageChangedEvent: any = '';
  @Output() saved: EventEmitter<boolean> = new EventEmitter()
  croppedLogo: any = '';
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
  merchant: Merchant;


  constructor(private merchant_service:MerchantsService,private fb: FormBuilder, private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
    this.merchant = this.merchant_service.current_merchant
    console.log(this.merchant)
   }


  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngOnInit(): void {

    this.initForms()

  }



  initForms() {
    //initialize profile form
    this.profileForm = this.fb.group({
      name: [this.merchant.name, [Validators.required]],   
      motto: [this.merchant.motto],
      banner_url: [this.merchant.banner_url],
      logo: [this.merchant.logo_url,[Validators.required]],
      commission: [this.merchant.commission, [Validators.required]],
      about: [this.merchant.about]
    })

    //fill in the images
    this.croppedLogo = this.merchant.logo_url
    // this.croppedBanner = this.merchant.banner_url
  
    //initial contacts
    this.contactsForm = this.fb.group({
      email: [this.merchant.email, [Validators.required, Validators.email]],
      street_address: [this.merchant.street_address, [Validators.required]],
      city: [this.merchant.city, [Validators.required]],
      country: [this.merchant.country, [Validators.required]],
      location: [this.merchant.location,[Validators.required]],
      lng:[this.merchant.location[0],[Validators.required]],
      lat:[this.merchant.location[1],[Validators.required]],
      contacts: this.getContacts(this.merchant.contacts)
    })


    //initializing operations form
    this.bussiness_hours_form = this.fb.group({
      monday: this.fb.group({
        opens: [this.merchant.bussiness_hours.monday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.monday.closes, [Validators.required]]
      }),
      tuesday: this.fb.group({
        opens: [this.merchant.bussiness_hours.tuesday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.tuesday.closes, [Validators.required]]
      }),
      wednesday: this.fb.group({
        opens: [this.merchant.bussiness_hours.wednesday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.wednesday.closes, [Validators.required]]
      }),
      thursday: this.fb.group({
        opens: [this.merchant.bussiness_hours.thursday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.tuesday.closes, [Validators.required]]
      }),
      friday: this.fb.group({
        opens: [this.merchant.bussiness_hours.friday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.friday.closes, [Validators.required]]
      }),
      saturday: this.fb.group({
        opens: [this.merchant.bussiness_hours.saturday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.saturday.closes, [Validators.required]]
      }),
      sunday: this.fb.group({
        opens: [this.merchant.bussiness_hours.sunday.opens, [Validators.required]],
        closes: [this.merchant.bussiness_hours.sunday.closes, [Validators.required]]
      })
    })
    
  }

  getContacts(contacts){
   let contacts_form = new FormArray([])
    contacts.map(contact => {
      contacts_form.push( 
        this.fb.group({
        contact_name: [contact.contact_name, Validators.required],
        phone_no: [contact.phone_no, Validators.required]
      }))
     
    });
    return contacts_form;
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
            this.save()
          })
        
        })
     )
    .subscribe()
  }

  uploadBanner() { 
    const file =  this.getBlob(this.croppedBanner)//event.target.files[0];
    
    //Create file path using restaurant_name underscored
    let res_name_array:[] = this.res_form.value.name.split(' ');
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

  // signUpGoogleAuth() {

  //   let email = this.res_form.get("email").value;
  //   let name = this.res_form.get("name").value;
  //   let default_password = this.res_form.get("default_password").value;
  //   return this.auth.createUserWithEmailAndPassword(email, default_password);
  // }

  submit(){
    this.uploadLogo();
  }


  save() {
    if(!this.logo_url){
      if(this.croppedLogo  === this.merchant.logo_url){
        this.logo_url = this.merchant.logo_url
      }else{
        this.uploadLogo()
        return
      }
     }

    let merchant:Merchant = {
      name: this.profileForm.value.name,
      email:this.contactsForm.value.email, //added
      contacts: this.contactsForm.value.contacts,  //modified
      logo_url: this.logo_url,
      bussiness_hours: this.bussiness_hours_form.value,
      categories: this.merchant.categories,
      location: [this.contactsForm.value.lng,this.contactsForm.value.lat],
      commission:this.profileForm.value.commission,
      about:this.profileForm.value.about,
      motto: this.profileForm.value.motto,
      city: this.contactsForm.value.city,
      country:this.contactsForm.value.country,
      tags:'',
      sections: this.merchant.sections,
      banner_url:'',//this.banner_url,
      street_address: this.contactsForm.value.street_address,
      open: this.merchant.open,
      distance:0,
      est_delivery_time: 0,
      cdn_delivery:false,
      timestamp:new Date().getTime() / 1000
    }

   console.log(merchant)
   this.db.doc(`merchants/${this.merchant['id']}`).set(merchant,{merge:true})
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


  // get phone_numbers() {
  //   return this.res_form.get('phone_numbers');
  // }



  get city() {
    return this.contactsForm.get('city');
  }

  // get country() {
  //   return this.res_form.get('country');
  // }

  // get categories() {
  //   return this.res_form.get('categories')
  // }

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
    this.upload(this.croppedLogo)
  }
  upload(base64){
    //convert base64 to image file
     let image_file = this.getBlob(base64)
    //upload image file to storage bucket
   
      const file = image_file
      const filePath = 'name-your-file-pat';
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
    
     //monitor uploading task
        // observe percentage changes
        this.uploadPercent = task.percentageChanges()

     //get the download url
 
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() =>
        { this.downloadURL = fileRef.getDownloadURL()
          .subscribe(x=>{
            console.log(x)
          })
        
        })
     )
    .subscribe()
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
  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
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
