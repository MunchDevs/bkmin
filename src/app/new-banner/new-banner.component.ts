import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-new-banner',
  templateUrl: './new-banner.component.html',
  styleUrls: ['./new-banner.component.css']
})
export class NewBannerComponent implements OnInit {

  cropping: boolean;
  constructor(private db: AngularFirestore, private fb: FormBuilder) { }


  get heading1() {
    return this.foodForm.get('heading1');
  }

  get heading2() {
    return this.foodForm.get('heading2');
  }

  get heading3() {
    return this.foodForm.get('heading3');
  }

  foodForm: FormGroup;
  @Output() save: EventEmitter<any> = new EventEmitter();

  imageChangedEvent: any = '';
  croppedImage: any = '';

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.foodForm = this.fb.group({
      heading1: [''],
      heading2: [''],
      heading3: [''],
      img: [''],
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.cropping = true
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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

  submit() {
    if (this.croppedImage) {
      this.foodForm.value.img = this.croppedImage;
      this.save.emit();
      this.db.collection('banners').add(this.foodForm.value);
      this.initForm()

      this.cropping = false
    }
  }



}
