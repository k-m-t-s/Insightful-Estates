import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from "../../service"
import * as d3 from 'd3';

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
    this.removeScatter()
    this.currState = state;
    this.apiservice.getConfig(state).subscribe(response => {
      this.data = response;
      this.convertToDate()
      this.addScatterPoints()
    });
  }
  typeChange1(){
    this.removeScatter()
    this.apiservice.getType(this.currState, 1).subscribe(response => {
      this.data = response; 
      this.convertToDate()
      this.addScatterPoints()
    });
  }
  typeChange2(){
    this.removeScatter()
    this.apiservice.getType(this.currState, 2).subscribe(response => {
      this.data = response;
      this.convertToDate()
      this.addScatterPoints()
    });
}
  private currState: any;
  private svg:any;
  private marginTop = 10;
  private marginBottom = 60;
  private marginLeft = 70;
  private marginRight = 30;
  private width = 1000;
  private height = 600;
  private data : any;
  private x : any;
  private y : any;

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
      this.addScatterPoints();
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
  }
  private drawGraph(){
    this.svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", this.width + this.marginLeft + this.marginRight)
      .attr("height", this.height + this.marginTop + this.marginBottom)
    .append("g")
      .attr("transform",
            "translate(" + this.marginLeft + "," + this.marginTop + ")");
  }
  private addScatterPoints() {
    this.x = d3.scaleTime()
    .domain([new Date("2000-01-31"), new Date("2023-09-30")])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.x));

    this.y = d3.scaleLinear()
    .domain([0, d3.max(this.data, (d: any) => (d.value)) as unknown as number + 100000])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(this.y));

    this.svg.append('g')
      .selectAll("dot")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", (d: any) => this.x(d.variable))
        .attr("cy",  (d: any) => this.y(d.value))
        .attr("r", 1.5)
        .style("fill", "#69b3a2");

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

    }
}