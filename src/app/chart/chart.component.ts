import { Component, OnInit, Input} from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  dataTime = []

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getSocket()
    this.getToke()
  }

  chart:any = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Linechart'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Temperature Data',
        data: []
      },
      {
        name: 'Humidity Data',
        data: []
      }
    ],
    xAxis: {
      title: { text: null},
      categories: this.dataTime,
      tickmarkPlacement: 'on',
      labels: {
          useHTML: false,
          step: 2,
          rotation: -40
      },
    },
  });
  
  add(data: number, index: number) {
    let series = this.chart.options.series[1],
                shift = series.data.length > 20; 
    this.chart.addPoint(data, index, true, shift);
  }

  getSocket(): void{
    const ws = 'ws://test.comismart.com/api/websocket'
    var mySocket = new WebSocket(ws);    
    let token = this.authService.getAuthorizationToken()
    let data1 = {
      "action": "authenticate",
      "token" : token.accessToken
    }
    let data2 = {
      "action" : "notification/subscribe",
      "deviceId" : "e50d6085-2aba-48e9-b1c3-73c673e414be",
      "names": ["measurement"]
    }
    mySocket.onopen = () => {
      mySocket.send(JSON.stringify(data1));
      mySocket.send(JSON.stringify(data2));
    };
    mySocket.onmessage = (e) => {
      if(e.data) {
        let data = JSON.parse(e.data)
        let temperatureData, humidityData, timestamp
        if(data.notification){
          temperatureData = data.notification.parameters.temperature.value
          humidityData = data.notification.parameters.humidity.value
          timestamp = data.notification.timestamp
          this.dataTime.push(timestamp)
          this.add(temperatureData,0)
          this.add(humidityData,1)
        }
      }
    } 
    // mySocket.close();
  }

  getToke(): void{
    this.authService.watchStorage()
    .subscribe((data:string) => {
      if(data) this.getSocket()
    })
  }
}
