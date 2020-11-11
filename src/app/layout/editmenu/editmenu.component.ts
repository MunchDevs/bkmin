import { Component, OnInit } from '@angular/core';
import { FakeDB } from '../../models/fake_db';
import { FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-editmenu',
  templateUrl: './editmenu.component.html',
  styleUrls: ['./editmenu.component.css']
})
export class EditmenuComponent implements OnInit {
  private db = new FakeDB()
  extrasForm: FormGroup;
  detailsForm: FormGroup;
  preferencesForm: FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    console.log(this.db.products[0])
    this.getCategories(this.db.products[0]['addon_categories'])

    this.detailsForm = this.fb.group({
      name: [this.db.products[0].name, Validators.required],
      prices: this.getPrices(this.db.products[0]['prices'])
    });

    this.extrasForm = this.fb.group({
      addon_categories:this.getCategories(this.db.products[0]['addon_categories'])
    });

    this.preferencesForm = this.fb.group({
      preferences: this.getPreference(this.db.products[0]['preferences'])
    });

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
            name:[''],
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
  

}
