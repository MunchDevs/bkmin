import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MerchantsService } from 'src/app/merchants.service';


@Component({
  selector: 'app-new-section',
  templateUrl: './new-section.component.html',
  styleUrls: ['./new-section.component.css']
})
export class NewSectionComponent implements OnInit {
 
  icons = [
    {name:'Cutlery',image_url:'001-cutlery'},
    {name:'Burger',image_url:'002-burger'},
    {name:'Hot dog',image_url:'003-hot dog'},
    {name:'French fries',image_url:'004-french fries'},
    {name:'Roast chicken',image_url:'005-roast chicken'},
    {name:'Chicken leg',image_url:'006-chicken leg'},
    {name:'Noodles',image_url:'007-noodles'},
    {name:'Baguette',image_url:'008-baguette'},
    {name:'Pizza',image_url:'009-pizza'},
    {name:'Taco',image_url:'010-taco'},
    {name:'Donut',image_url:'011-donut'},
    {name:'Sushi',image_url:'012-sushi'},
    {name:'Rice',image_url:'013-rice'},
    {name:'Chocolate bar',image_url:'014-chocolate bar'},
    {name:'Bread',image_url:'015-bread'},
    {name:'Popcorn',image_url:'016-popcorn'},
    {name:'Satay',image_url:'017-satay'},
    {name:'Pancakes',image_url:'018-pancakes'},
    {name:'Sushi2',image_url:'019-sushi'},
    {name:'Steak',image_url:'020-steak'},
    {name:'Serving',image_url:'021-serving'},
    {name:'Menu',image_url:'022-menu'},
    {name:'Salt',image_url:'023-salt'},
    {name:'Chili sauce',image_url:'024-chili sauce'},
    {name:'Tomato sauce',image_url:'025-tomato sauce'},
    {name:'Bill',image_url:'026-bill'},
    {name:'Milk',image_url:'027-milk'},
    {name:'Chef',image_url:'028-chef'},
    {name:'Terrace',image_url:'029-terrace'},
    {name:'Wine glass',image_url:'030-wine glass'},
    {name:'Soup',image_url:'031-soup'},
    {name:'Avocado',image_url:'032-avocado'},
    {name:'Ice cream',image_url:'033-ice cream'},
    {name:'Orange',image_url:'034-orange'},
    {name:'Banana',image_url:'035-banana'},
    {name:'Mineral water',image_url:'036-mineral water'},
    {name:'Coffee',image_url:'037-coffee'},
    {name:'Martini',image_url:'038-martini'},
    {name:'Waiter',image_url:'039-waiter'},
    {name:'Beer',image_url:'040-beer'},
    {name:'Apple',image_url:'041-apple'},
    {name:'Dish',image_url:'042-dish'},
    {name:'Prawn',image_url:'043-Prawn'},
    {name:'Fried egg',image_url:'044-fried egg'},
    {name:'Tea',image_url:'045-tea'},
    {name:'Barista',image_url:'046-barista'},
    {name:'Strawberry',image_url:'047-strawberry'},
    {name:'Milkshake',image_url:'048-milkshake'},
    {name:'Coffee',image_url:'049-coffee'},
    {name:'Cupcake',image_url:'050-cupcake'},
  ]

  form:FormGroup


  constructor(private merchants_service:MerchantsService,private fb:FormBuilder,private db:AngularFirestore,public dialogRef: MatDialogRef<NewSectionComponent>,
  @Inject(MAT_DIALOG_DATA) public data) {
      
  }

  ngOnInit(): void {
   this.form = this.fb.group({
     name:['',[Validators.required]],
     icon_name:['',[Validators.required]], 
     products:[[]]
   })
   console.log(this.merchants_service.current_merchant)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    console.log(this.form.value)
    this.db.collection(`drivers`).add(this.form.value)
    this.dialogRef.close();

  }

  saveSection(){

    this.merchants_service.current_merchant.sections.push(this.form.value)
    console.log(this.merchants_service.current_merchant)
    this.db.doc(`merchants/${this.merchants_service.current_merchant['id']}`).set(this.merchants_service.current_merchant,{merge:true})
  }

}
