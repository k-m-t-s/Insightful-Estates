import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ApiserviceService } from "../../service"
import * as d3 from 'd3';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

interface states {
  state: string;
  abv: string;
}

@Component({
  selector: 'app-side-controls',
  templateUrl: './side-controls.component.html',
  styleUrls: ['./side-controls.component.css']
})

export class SideControlsComponent implements OnInit {
  state: states[] = [
    {state: 'Arizona', abv: 'AZ'},
    {state: 'California', abv: 'CA'},
    {state: 'Florida', abv: 'FL'},
    {state: 'Georgia', abv: 'GA'},
    {state: 'Illinois', abv: 'IL'},
    {state: 'Massachusetts', abv: 'MA'},
    {state: 'Michigan', abv: 'MI'},
    {state: 'New Jersey', abv: 'NJ'},
    {state: 'New York', abv: 'NY'},
    {state: 'North Carolina', abv: 'NC'},
    {state: 'Ohio', abv: 'OH'},
    {state: 'Pennsylvania', abv: 'PA'},
    {state: 'Tennessee', abv: 'TN'},
    {state: 'Texas', abv: 'TX'},
    {state: 'Virginia', abv: 'VA'},
    {state: 'Washington', abv: 'WA'}
  ];
  selectedState = this.state[0].state;
  stateChange(state: String){
    if (this.matSlideToggle.checked){
      this.matSlideToggle?.toggle()
    }
    this.removeScatter()
    this.currState = state;
    this.apiservice.getConfig(state).subscribe(response => {
      this.data = response;
      this.convertToDate()
      this.addScatterPoints(false)
    });
  }
  typeChange1(){
    if (this.matSlideToggle.checked){
      this.matSlideToggle?.toggle()
    }
    this.removeScatter()
    this.apiservice.getType(this.currState, 1).subscribe(response => {
      this.data = response; 
      this.convertToDate()
      this.addScatterPoints(false)
    });
  }
  typeChange2(){
    if (this.matSlideToggle.checked){
      this.matSlideToggle?.toggle()
    }
    this.removeScatter()
    this.apiservice.getType(this.currState, 2).subscribe(response => {
      this.data = response;
      this.convertToDate()
      this.addScatterPoints(false)
    });
  }

  togglePredict(ob: MatSlideToggleChange){
    if (ob.checked){
      this.removeScatter()
      this.apiservice.getFuture(this.currState, 1).subscribe(response => {
        this.data = response;
        this.convertToDate()
        this.addScatterPoints(true)
      });
    }
    else{
      this.removeScatter()
      this.apiservice.getFuture(this.currState, 1).subscribe(response => {
        this.data = response;
        this.convertToDate()
        this.addScatterPoints(true)
      });
    }
  }

  private currState: any;
  private svg:any;
  private marginTop = 10;
  private marginBottom = 60;
  private marginLeft = 70;
  private marginRight = 30;
  private width = 800;
  private height = 600;
  private data : any;
  private x : any;
  private y : any;
  private horizontalLines: any;
  private area: any;

  @ViewChild('slide')
  matSlideToggle!: MatSlideToggle;

  ngOnInit(): void {
    this.getData("AZ")
    this.currState = "AZ";
  }
  constructor(private apiservice:ApiserviceService) { }

  private getData(state: String) {
    this.apiservice.getConfig(state).subscribe(response => {
      this.data = response; 
      this.convertToDate();
      this.drawGraph();
      this.addScatterPoints(false);
    });
  }
  private convertToDate(){
    for(let index=0; index < this.data.length; index++){
        this.data[index]["variable"] = new Date(this.data[index]["variable"])
    }
    console.log(this.data)
  }
  private removeScatter() {
    this.svg.selectAll("path").remove();
    this.svg.selectAll("g").remove();
    this.horizontalLines.remove()
  }
  private drawGraph(){
    this.svg = d3.select("#scatterPlot").append("svg")
        .attr("width", this.width + this.marginLeft + this.marginRight)
        .attr("height", this.height + this.marginTop + this.marginBottom)
      .append("g")
        .attr("transform",
              "translate(" + this.marginLeft + "," + this.marginTop + ")");
      // .attr("width", '100%')
      // .attr("height", '100%')
      // .attr('viewBox','0 0 600 800')
      // // .attr('preserveAspectRatio','xMinYMin')
      // .attr("transform",
      //         "translate(" + this.marginLeft + "," + this.marginTop + ")");
  }

  private addScatterPoints(predict: boolean) {
    if(predict){
    this.x = d3.scaleTime()
      .domain([new Date("2015-01-31"), new Date("2026-09-30")])
      .range([ 0, this.width ]);
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x));
    }
    else{
      this.x = d3.scaleTime()
        .domain([new Date("2000-01-31"), new Date("2023-09-30")])
        .range([ 0, this.width ]);
      this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x));
    }

    this.y = d3.scaleLinear()
    .domain([0, d3.max(this.data, (d: any) => (d.value)) as unknown as number + 100000])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(this.y)
      .ticks(8)
    );

    this.svg.append('g')
      .selectAll("dot")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", (d: any) => this.x(d.variable))
        .attr("cy",  (d: any) => this.y(d.value))
        .attr("r", 1.5)
        .style("fill", "#69b3a2");
    
    this.horizontalLines = this.svg.selectAll("gH")
      .data(this.y.ticks(8).slice(1))
      .join("line")
      .attr("y1", (d: any) => this.y(d)).attr("y2", (d: any) => this.y(d))
      .attr("x1", 0).attr("x2", this.width)
      .attr("stroke", "#6c757d")
      .attr("stroke-width", 0.5);

    this.svg.append('text')
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", this.width/2)
      .attr("y", this.height+ this.marginTop +40)
      .text("Date");

    this.svg.append('text')
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -this.height/2+30)
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .text("Home Value in U.S. Dollar");
      
    if(predict){
      this.area = d3.area()
        .x((d:any) => this.x(d.variable))
        .y0((d:any) => this.y(d.lower))
        .y1((d:any) => this.y(d.upper))
      this.svg.append("path")
        .datum(this.data)
        .attr("class", "area")
        .attr("d", this.area)
        .style("fill","#85bb65")
        .style("opacity", .5)
    }

    }
}