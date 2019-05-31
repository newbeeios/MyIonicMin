import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams, ModalController } from 'ionic-angular';
import {SignaturePage} from '../signature/signature'


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  selectedAnimation: any = "interactive";
  animations: any;
  interactive = false;
  anim: any;
  animationSpeed: number = 1;

  interactiveAnimationOption = {
    loop: false,
    prerender: false,
    autoplay: false,
    autoloadSegments: false,
    path: 'assets/animations/other/jake.json'
  }

  lottieAnimations = [
    {
      path: 'assets/animations/lottie/check-animation.json'
    }, {
      path: 'assets/animations/lottie/material-wave-loading.json'
    }
  ];

  bodymovinAnimations = [
    {
      path: 'assets/animations/lottie/check-animation.json'
    }, {
      path: 'assets/animations/lottie/material-wave-loading.json'
    },
  ]

  otherAnimations = [
    {
      path: 'assets/animations/lottie/check-animation.json'
    }, {
      path: 'assets/animations/lottie/material-wave-loading.json'
    }
  ]

  constructor(public navCtrl: NavController) {
    this.changeAnimations();
  }

  handleAnimation(anim) {
    this.anim = anim;
  }

  stop() {
      this.anim.stop();
  }

  play() {
      this.anim.play();
  }

  pause() {
      this.anim.pause();
  }

  setSpeed() {
      this.anim.setSpeed(this.animationSpeed);
  }

  animate() {
    this.anim.playSegments([[27, 142], [14, 26]], true);
  }

  changeAnimations() {
    this.interactive = false;
    switch (this.selectedAnimation) {
      case "lottie":
        this.animations = this.lottieAnimations;
        break;
      case "bodymovin":
        this.animations = this.bodymovinAnimations;
        break;
      case "other":
        this.animations = this.otherAnimations;
        break;
      case "interactive":
        this.interactive = true;
        break;
    }
  }

}
