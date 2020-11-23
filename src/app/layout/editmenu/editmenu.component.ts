import { Component, OnInit } from '@angular/core';
import { FakeDB } from '../../models/fake_db';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Product } from 'src/app/models/models';
import { MerchantsService } from 'src/app/merchants.service';
import { AngularFirestore } from '@angular/fire/firestore';
import {Location} from '@angular/common';

@Component({
  selector: 'app-editmenu',
  templateUrl: './editmenu.component.html',
  styleUrls: ['./editmenu.component.css']
})
export class EditmenuComponent implements OnInit {
  private db = new FakeDB()

  isLinear = false;
  extrasForm: FormGroup;
  detailsForm: FormGroup;
  preferencesForm: FormGroup;
  imageChangedEvent: any = '';
  mechant_name;

  croppedimage: any = '';
  image_url;
  uploadPercent;
  downloadURL;
  Categories = [];
  imageCropping: boolean = false;
  product
  percent: number;
  constructor(private _location: Location,private fdb:AngularFirestore,private merchants_service:MerchantsService,private fb:FormBuilder,private storage: AngularFireStorage) { 
    this.mechant_name =  this.merchants_service.current_merchant.name 
  }

  ngOnInit(): void {
    this.product = this.merchants_service.current_section.products[this.merchants_service.current_product_index]
    console.log(this.product)
    this.getCategories(this.product['addon_categories'])

    this.detailsForm = this.fb.group({
      name: [this.product.name, Validators.required],
      description: [this.product.description],
      prices: this.getPrices(this.product['prices'])
    });

    this.extrasForm = this.fb.group({
      addon_categories:this.getCategories(this.product['addon_categories'])
    });

    this.preferencesForm = this.fb.group({
      preferences: this.getPreference(this.product['preferences'])
    });

    this.croppedimage = this.product.image_url

  }

  updatePriceSize(p){
    let size_name =  (<FormControl>this.detailsForm.get('prices')['controls'][p]).value['size']
    console.log(size_name)
      this.updateAddonPrice(p,size_name)
   }


  pushItemPrice(){
    (<FormArray>this.detailsForm.get('prices')).push(
      this.fb.group({
        size:[''],
        price:['']
      })
    )
    this.pushAddonPrice()  
  }

  removeItemPrice(p){
    (<FormArray>this.detailsForm.get('prices')).removeAt(p)
    this.removeAddonPrice(p)
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


  pushAddonPrice(){
    this.extrasForm.get('addon_categories')['controls'].forEach(cat => {
      console.log('feed')
      //loop the addons
      cat.get('addons')['controls'].forEach(adon => {
          console.log('addon');
          (<FormArray>adon.get('prices')['controls']).push(
           this.fb.group({
                 size:[''],
                 price:['']
               })
          )
      });
    });
 
    //push preference size price
    this.preferencesForm.get('preferences')['controls'].forEach(pref => {
   
     (<FormArray>pref.get('prices')['controls']).push(
       this.fb.group({
             size:[''],
             price:['']
           })
      )
 
    });
 
   }


  updateAddonPrice(p,size_name){
    this.extrasForm.get('addon_categories')['controls'].forEach(cat => {
      console.log('feed')
      //loop the addons
      cat.get('addons')['controls'].forEach(adon => {
          console.log('addon');
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
  
  
  getPrices(prices:any[]){
    let temp_prices = new FormArray([])
    prices.forEach(p=>{
      temp_prices.push(
        this.fb.group({
          size:[p.size],
          price:[p.price]
        })
      )
    })
    return temp_prices
  }

  //loop each addon category 
  getCategories(categories){
     console.log(categories)
     let addon_categories_form_array = new FormArray([])
     categories.forEach(cat => {
       //temporary addons
       let addons_form_array = new FormArray([])
       cat.addons.forEach(addon=>{
         let prices_form_array = new FormArray([])
         addon.prices.forEach(price => {
           prices_form_array.push(
            this.fb.group({
              size:[price.size],
              price:[price.price]
            })
           )
         });

         addons_form_array.push(
          this.fb.group({
            name:[addon.name],
            required:[addon.required],
            prices: prices_form_array
          })
         )
         //push the addon to the temp form array
       })
       addon_categories_form_array.push(     
         this.fb.group({
            name:[cat.name],
            required:[false],
            select_option:[''],
            addons:addons_form_array
      }))
   
     });
     return addon_categories_form_array
  }

  getPreference(preferences:any){
    let temp_prefs:FormArray = new FormArray([])
    preferences.forEach(pref => {
      temp_prefs.push(
   
          this.fb.group({
            name:[pref.name],
            prices:this.getPrices(pref.prices)
          })
     
      )
    });
    return temp_prefs
  }

  pushAddonCategory(){
    let item_sizes:FormArray = new FormArray([]);
    this.detailsForm.get('prices')['controls'].forEach(p => {
      item_sizes.push(
        this.fb.group({
          size:[p.get('size').value],
          price:['']
        })
      )
    });

     (<FormArray>this.extrasForm.get('addon_categories')).push(
      this.fb.group({
        name:[''],
        required:[false],
        select_option:[''],
        addons:new FormArray([
          this.fb.group({
            name:[''],
            required:[''],
            prices: item_sizes
            
          })
        ]),
      })
    )
  }

  removeAddonCategory(cat_idx) {
    (<FormArray>this.extrasForm.get('addon_categories')).removeAt(cat_idx)
  }

  removeAddon(cat_idx,adn_idx) {
    (<FormArray>this.extrasForm.get('addon_categories')['controls'][cat_idx].get('addons')).removeAt(adn_idx)
  }

  pushPreferencePrice(pref_idx){
    (<FormArray>this.preferencesForm.get('preferences')['controls'][pref_idx].get('prices')['controls']).push(
      this.fb.group({
        size:[''],
        price:['']
      })
    )
  }

  pushPreference() {
    let item_sizes:FormArray = new FormArray([]);
    this.detailsForm.get('prices')['controls'].forEach(p => {
      item_sizes.push(
        this.fb.group({
          size:[p.get('size').value],
          price:['']
        })
      )
    });

    (<FormArray>this.preferencesForm.get('preferences')).push(
      this.fb.group({
        name:[''],
        prices: item_sizes
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
            this.image_url = x;
            // this.product.image_url = this.image_url 
            // this.croppedimage = this.product.image_url
            // this.submit()
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
  //  if(this.imageCropped !== this.product.image_url) {
  //    this.uploadimage();
  //    return
  //  }
    if(!this.image_url){
        if(this.croppedimage === this.product.image_url){
          this.image_url = this.product.image_url
        }else{
          this.uploadimage()
          return
        }
     
    }
    if(this.image_url){
      let product:Product = {
        name: this.detailsForm.value.name,
        description:this.detailsForm.value.description,
        image_url: this.image_url,
        available: true,
        addon_categories: this.extrasForm.value.addon_categories,
        preferences: this.preferencesForm.value.preferences,
        // merchant_id: this.merchants_service.current_merchant.id, //remove
        prices: this.detailsForm.value.prices
      }

      //
      console.log(product) 

      this.merchants_service.current_merchant.sections[this.merchants_service.current_section_index].products[this.merchants_service.current_product_index] = product;
      console.log(this.merchants_service.current_merchant)
      this.fdb.doc(`merchants/${this.merchants_service.current_merchant['id']}`).set(this.merchants_service.current_merchant,{merge:true})
      this._location.back();
    }else{
      console.log('please upload image')
    }

  }

delete(){
  this.merchants_service.current_merchant.sections[this.merchants_service.current_section_index].products.splice(this.merchants_service.current_product_index,1);
  this.fdb.doc(`merchants/${this.merchants_service.current_merchant['id']}`).set(this.merchants_service.current_merchant,{merge:true})
  this._location.back();
}
  

}
