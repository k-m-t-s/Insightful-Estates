import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from "../../service"
import * as d3 from 'd3';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-side-controls',
  templateUrl: './side-controls.component.html',
  styleUrls: ['./side-controls.component.css']
})

export class SideControlsComponent implements OnInit {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  selectedFood = this.foods[2].value;

  private svg:any;
  private marginTop = 10;
  private marginBottom = 30;
  private marginLeft = 60;
  private marginRight = 30;
  private width = 1000;
  private height = 600;
  private data : any;
  private x : any;
  private y : any;

  ngOnInit(): void {
    this.getData()
  }

  constructor(private apiservice:ApiserviceService) { }

  private getData() {
    this.apiservice.getConfig().subscribe(response => {
      this.data = response; 
      this.convertToDate()
      this.drawScatter()
    });
  }
  private convertToDate(){
    for(let index=0; index < this.data.length; index++){
        this.data[index]["variable"] = new Date(this.data[index]["variable"])
    }
    console.log(this.data)
  }
  private drawScatter() {
    this.svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", this.width + this.marginLeft + this.marginRight)
      .attr("height", this.height + this.marginTop + this.marginBottom)
    .append("g")
      .attr("transform",
            "translate(" + this.marginLeft + "," + this.marginTop + ")");
  
    this.x = d3.scaleTime()
    .domain([new Date("2000-01-31"), new Date("2023-09-30")])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.x));

    this.y = d3.scaleLinear()
    .domain([0, 1500000])
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

  }
}