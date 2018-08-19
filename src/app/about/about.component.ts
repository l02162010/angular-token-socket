import { Component, OnInit } from '@angular/core';
import { AppService } from "../app.service";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  deviceData: object = null
  socketData: object = null
  
  constructor(
    private appService: AppService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getDevice()
    this.getToke()
  }

  getDevice(): void{
    this.appService.getDevice()
      .subscribe((res)=>{
        if(res){
          this.deviceData = res
        }
      })
  }
  getToke(): void{
    this.authService.watchStorage()
    .subscribe((data:string) => {
      if(data) this.getDevice()
    })
  }
}
