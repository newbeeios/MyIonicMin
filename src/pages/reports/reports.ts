import { Component, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './../../providers/auth.service';

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
//   @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
//   @ViewChild('lineCanvas') lineCanvas;
  barChart: any;
  doughnutChart: any;

  formslist:any[] = []; //['Forms List Registration Form','Storage Form','Transportation Form','Volunteer Monitoring','Inspection Form','Audit Form','Vehicle Inspection','Planting Form','Feedback Form','Pre Planting Form','Upload Test'];
  countslist: any[] = []; //['10','20','30','10','20','30','10','20','30','10','20'];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af:AngularFireDatabase,private authSer: AuthService) {



            this.af.list('/forms', {
                query: {
                    limitToLast: 200,
                    orderByChild: 'createdby',
                    equalTo: this.authSer.userDetails.email,
                   // preserveSnapshot: true
                }
            }).subscribe(snapshot => {
                if (snapshot != undefined) {
                    //console.log(snapshot);
                    this.formslist=[];
                    this.countslist=[];
                    snapshot.forEach((childSnapshot) => {

                        //console.log(childSnapshot);
                        this.formslist.push(childSnapshot.displaytext);
                        this.countslist.push(childSnapshot.datacount==undefined?0:(childSnapshot.datacount));
                        return false;
                    });
                    this.loadReports();
                    console.log("Subscription Fired");
                    console.log("Forms List "+this.formslist);
                    console.log("Counts List "+this.countslist);
                }
    
            });


  }


 loadReports(){



    // this.barChart = new Chart(this.barCanvas.nativeElement, {
      
    //     type: 'bar',
    //     data: {
    //         labels:  this.formslist,  //["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Brown","Yellow"],
    //         datasets: [{
    //             label: '# of Forms Submitted',
    //             data: this.countslist,  //[12, 19, 3, 5, 2, 3,10,6],
    //             backgroundColor: [
    //                'rgba(255, 99, 132, 0.2)',
    //                'rgba(54, 162, 235, 0.2)',
    //                'rgba(255, 206, 86, 0.2)',
    //                'rgba(75, 192, 192, 0.2)',
    //                'rgba(153, 102, 255, 0.2)',
    //                'rgba(255, 159, 64, 0.2)',
    //                'rgba(218, 247, 166,0.2)',
    //                'rgba(255, 195, 0  ,0.2)',
    //                'rgba(255, 87, 51  ,0.2)',
    //                'rgba(88, 24, 69  ,0.2)',
    //                'rgba(51, 196, 255,0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 }
    //             }]
    //         }
    //     }

    // });


    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
     
                type: 'doughnut',
                data: {
                    labels: this.formslist,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Forms Submitted',
                        data: this.countslist, //[12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(218, 247, 166,0.2)',
                            'rgba(255, 195, 0  ,0.2)',
                            'rgba(255, 87, 51  ,0.2)',
                            'rgba(88, 24, 69  ,0.2)',
                            'rgba(51, 196, 255,0.2)'
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ]
                    }]
                }
     
            });
     
           
 }

  ionViewDidLoad() {

 
     
  }

}
