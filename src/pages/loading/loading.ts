import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  selectedAnimation: any = "interactive";
  animations: any;
  interactive = false;
  anim: any;
  animationSpeed: number = 1;



  lottieAnimations = [
    {
      path: 'assets/animations/lottie/material-wave-loading.json'
    }
  ];



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
    this.animations = this.lottieAnimations;
  }


}
