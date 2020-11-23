import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { MerchantsService } from 'src/app/merchants.service';
import { Product } from '../../models/models';
import { Location } from '@angular/common';


@Component({
  selector: 'app-new-menu-item',
  templateUrl: './new-menu-item.component.html',
  styleUrls: ['./new-menu-item.component.css']
})
export class NewMenuItemComponent implements OnInit {

  isLinear = false;
  detailsForm: FormGroup;
  extrasForm: FormGroup;
  preferencesForm: FormGroup;
  imageChangedEvent: any = '';
  mechant_name;
  croppedimage: any = '';
  image_url;
  uploadPercent;
  downloadURL;
  Categories = [];
  imageCropping: boolean = false;
  percent
  constructor(private _location: Location,private merchants_service:MerchantsService,private db:AngularFirestore, private fb:FormBuilder ,private storage: AngularFireStorage) { 
     this.mechant_name =  this.merchants_service.current_merchant.name 

  }
  form:FormGroup;
  
  select_options = ['multiple','single']
  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      description:[''],
      prices: new FormArray([
        this.fb.group({
          size:['',[Validators.required]],
          price:['',[Validators.required]]
        })
      ])
    });

    this.extrasForm = this.fb.group({
      addon_categories:new FormArray([]), 
    });

    this.preferencesForm = this.fb.group({
      preferences: new FormArray([])
    });

  }

  
  
  //These are array forms that are pushed thats
  

  initForms(){

  }

  pushSizePrice(){
    //loop all addon categories up to
  }

  pushItemPrice(){
    (<FormArray>this.detailsForm.get('prices')).push(
      this.fb.group({
        size:['',[Validators.required]],
        price:['',[Validators.required]]
      })
    )
    this.pushAddonPrice()  
  }

  removeItemPrice(p){
    (<FormArray>this.detailsForm.get('prices')).removeAt(p)
    this.removeAddonPrice(p)
  }

  updatePriceSize(p){
   let size_name =  (<FormControl>this.detailsForm.get('prices')['controls'][p]).value['size']
  //  console.log(size_name)
     this.updateAddonPrice(p,size_name)
  }

  pushAddonCategory(){
    let item_sizes:FormArray = new FormArray([]);
    this.detailsForm.get('prices')['controls'].forEach(p => {
      item_sizes.push(
        this.fb.group({
          size:[p.get('size').value,[Validators.required]],
          price:['',[Validators.required]]
        })
      )
    });

     (<FormArray>this.extrasForm.get('addon_categories')).push(
      this.fb.group({
        name:['',[Validators.required]],
        required:[false,[Validators.required]],
        select_option:['',[Validators.required]],
        addons:new FormArray([
          this.fb.group({
            name:['',[Validators.required]],
            prices: item_sizes
            
          })
        ]),
      })
    )
  }

  removeAddonCategory(cat_idx) {
    (<FormArray>this.extrasForm.get('addon_categories')).removeAt(cat_idx)
  }

  pushAddon(cat_idx){
    let item_sizes:FormArray = new FormArray([]);
    this.detailsForm.get('prices')['controls'].forEach(p => {
      item_sizes.push(
        this.fb.group({
          size:[p.get('size').value,[Validators.required]],
          price:['',[Validators.required]]
        })
      )
    });

    (<FormArray>this.extrasForm.get('addon_categories')['controls'][cat_idx].get('addons')['controls']).push(
      this.fb.group({
        name:['',[Validators.required]],
        prices:item_sizes
      })
    )
  }

  removeAddon(cat_idx,adn_idx) {
    (<FormArray>this.extrasForm.get('addon_categories')['controls'][cat_idx].get('addons')).removeAt(adn_idx)
  }


  pushAddonPrice(){
   this.extrasForm.get('addon_categories')['controls'].forEach(cat => {
    //  console.log('feed')
     //loop the addons
     cat.get('addons')['controls'].forEach(adon => {
        //  console.log('addon');
         (<FormArray>adon.get('prices')['controls']).push(
          this.fb.group({
                size:['',[Validators.required]],
                price:['',[Validators.required]]
              })
         )
     });
   });

   //push preference size price
   this.preferencesForm.get('preferences')['controls'].forEach(pref => {
  
    (<FormArray>pref.get('prices')['controls']).push(
      this.fb.group({
            size:['',[Validators.required]],
            price:['',[Validators.required]]
          })
     )

   });

  }

  updateAddonPrice(p,size_name){
    this.extrasForm.get('addon_categories')['controls'].forEach(cat => {
      // console.log('feed')
      //loop the addons
      cat.get('addons')['controls'].forEach(adon => {
          // console.log('addon');
          (<FormControl>adon.get('prices')['controls'][p].get('size')).setValue(size_name);

      });
    });

    this.preferencesForm.get('preferences')['controls'].forEach(pref => {
  
      (<FormControl>pref.get('prices')['controls'][p].get('size')).setValue(size_name);
  
     });
 
   }




  removeAddonPrice(prc_idx) {

      this.extrasForm.get('addon_categories')['controls'].forEach(cat => {
        // console.log('feed')
        //loop the addons
        cat.get('addons')['controls'].forEach(adon => {
            // console.log('addon');
            adon.get('prices')['controls'].splice(prc_idx,1)
        });
      })

      this.preferencesForm.get('preferences')['controls'].forEach(pref => {
  
        pref.get('prices')['controls'].splice(prc_idx,1)
    
       });
}





  pushPreference() {
    let item_sizes:FormArray = new FormArray([]);
    this.detailsForm.get('prices')['controls'].forEach(p => {
      item_sizes.push(
        this.fb.group({
          size:[p.get('size').value,[Validators.required]],
          price:['',[Validators.required]]
        })
      )
    });

    (<FormArray>this.preferencesForm.get('preferences')).push(
      this.fb.group({
        name:['',[Validators.required]],
        prices: item_sizes
      })
    )
  }

  pushPreferencePrice(pref_idx){
    (<FormArray>this.preferencesForm.get('preferences')['controls'][pref_idx].get('prices')['controls']).push(
      this.fb.group({
        size:['',[Validators.required]],
        price:['',[Validators.required]]
      })
    )
  }


  removePreference(i) {
    (<FormArray>this.preferencesForm.get('preferences')).removeAt(i)
  }
    
  removePreferencePrice(pref_idx,prc_idx) {
    (<FormArray>this.preferencesForm.get('preferences')['controls'][pref_idx].get('prices')).removeAt(prc_idx)
  }

  imageChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageCropping = true
  }

  imageCropped(event: ImageCroppedEvent) {
    // console.log(event)
    this.croppedimage = event.base64;
    // x = (n * (3/4)) - y
    // console.log(this.croppedimage)
  }

  uploadimage() { 
    this.imageCropping=false
    const file =  this.getBlob(this.croppedimage)//event.target.files[0];
    
    //Create file path using restaurant_name underscored
    let res_name_array:string[] = this.mechant_name.split(' ');
    // console.log(res_name_array) 
    let res_name_joined = res_name_array.join("_")
    // console.log(res_name_joined)
    let item_name_array:string[] = this.detailsForm.value.name.split(' ');
    // console.log(item_name_array) 
    let item_name_joined = item_name_array.join("_")

    const filePath = `${res_name_joined}/products/${item_name_joined}`;
  
    const fileRef = this.storage.ref(filePath);
    // console.log(filePath)
    const task = this.storage.upload(filePath, file,{ customMetadata: { cacheControl: 'public,max-age=4000' } });

    //monitor uploading task
    //observe percentage changes
    this.uploadPercent = task.percentageChanges()
    task.percentageChanges().subscribe(x=>{
      console.log(x)
      this.percent = x
    })
    //get the download url
 
    //get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() =>
        { 
          this.downloadURL = fileRef.getDownloadURL()
          .subscribe(x=>{
            console.log(x)
            //save image url
            this.image_url = x
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
    // console.log('returning to blog')
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

  submit(){

    if(this.image_url){
      let product:Product = {
        name: this.detailsForm.value.name,
        description: this.detailsForm.value.description,
        image_url: this.image_url,
        available: true,
        addon_categories: this.extrasForm.value.addon_categories,
        preferences: this.preferencesForm.value.preferences,
        // merchant_id: this.merchants_service.current_merchant.id, //remove
        prices: this.detailsForm.value.prices
     
     
     
      }

      //
      console.log(product) 

      this.merchants_service.current_merchant.sections[this.merchants_service.current_section_index].products.push(product);
      console.log(this.merchants_service.current_merchant)
      // this.db.doc(`merchants/${this.merchants_service.current_merchant['id']}`).set(this.merchants_service.current_merchant,{merge:true})
     
      this._location.back();

    }else{
      console.log('please upload image')
    }

  }

}
