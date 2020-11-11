import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-new-section',
  templateUrl: './new-section.component.html',
  styleUrls: ['./new-section.component.css']
})
export class NewSectionComponent implements OnInit {
  imageChangedEvent: any = '';

  croppedimage: any = '';
  image_url
  icons = [
    {name:'burger',image_url:'002-burger'},
    {name:'hot dog',image_url:'003-hot dog'},
    {name:'pizza',image_url:'009-pizza'},
  ]
  Categories = [];
  imageCropping: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  imageChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageCropping = true
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedimage = event.base64;
    // this.upload(this.croppedimage)
  }

  uploadimage() { 
    // const file =  this.getBlob(this.croppedimage)//event.target.files[0];
    
    // //Create file path using restaurant_name underscored
    // let res_name_array:[] = this.res_form.value.name.split(' ');
    // console.log(res_name_array) 
    // let res_name_joined = res_name_array.join("_")
    // console.log(res_name_joined)
    // const filePath = `${res_name_joined}/image`;
    // const fileRef = this.storage.ref(filePath);
    // console.log(filePath)
    // const task = this.storage.upload(filePath, file);

    // //monitor uploading task
    // //observe percentage changes
    // this.uploadPercent = task.percentageChanges()

    // //get the download url
 
    // //get notified when the download URL is available
    // task.snapshotChanges().pipe(
    //     finalize(() =>
    //     { 
    //       this.downloadURL = fileRef.getDownloadURL()
    //       .subscribe(x=>{
    //         console.log(x)
    //         //save image url
    //         this.image_url = x
           
    //       })
        
    //     })
    //  )
    // .subscribe()
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
