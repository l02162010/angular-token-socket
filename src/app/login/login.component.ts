import { Component, OnInit } from '@angular/core';
import { AppService } from "../app.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  acc: string = ""
  pwd: string = ""

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {

  }
  doLogin(acc: string, pwd: string): void{
    let data = {
      login: acc,
      password: pwd
    }
    this.appService.doLogin(data)
      .subscribe((res)=>{
        if(res) this.router.navigateByUrl('/about');
      })
  }
}
