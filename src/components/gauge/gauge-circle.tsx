import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'gauge-circle',
  styleUrl: 'gauge-circle.scss',
  shadow: true
})
export class GaugeCircle {

  @Prop() value: number = 0;
  @Prop() unit: string = "unit";
  @Prop() size: number = 100;
  @Prop() max: number = 100;


  computeStyle () {
    return {"--dashOffset":""+this.computeLength()}
  }


  render() {
    return (
      <div>
      <div class="metersWrapper">
        <div class="meter">
          <div class="insideWrapper">
            <div class="insideWrapper__number">{this.value}</div>
            <div class="insideWrapper__desc">{this.unit}</div>
          </div>
          <svg width={this.size+"px"} height={this.size+"px"} >
            <circle class="circle" cx={this.size/2} cy={this.size/2} r={this.computeR()}/>
            <path class="arc first" style={this.computeStyle()} stroke-dasharray={this.computeLength()} d={this.computeD()}  ></path>
          </svg>
        </div>
      </div>
      </div>
    );
  }

  computePct() {
    return this.value<=this.max ? this.value / this.max * 100 :100
  }

  computeR () {
    return this.size/2-5
  }

  computePerimeter () {
    return 2 * Math.PI * this.computeR();
  }

  computeLength () {
    return this.computePerimeter() * (this.value / this.max)
  }

  computeD () {
    // Le pourcentage
    //Angle de départ
    let start = -90;
    //Angle final
    let end = start + this.computePct() * 3.6;
    return this.describeArc({ "x" : this.size/2, "y" : this.size/2}, this.computeR(), start, end);
  };

  /**
   * Calcul les coordonnées d'un point d'un cercle à partir de son angle en degré
   * pour un repère orienté en dans le sens direct (tourne de x>0 vers y>0)
   * @param array $center tableau des coordonnées du centre du cercle
   * @param float $radius rayon du cercle
   * @param float $angleInDegrees angle en degré du point sur le cercle
   * @return array[x,y] tableau des coordonnées cartésiennes du point
   */
  polarToCartesian(center, radius, angleInDegrees) {
      let angleInRadians = angleInDegrees * Math.PI / 180.0;

      return {
          "x" : center.x + radius * Math.cos(angleInRadians),
          "y" : center.y + radius * Math.sin(angleInRadians)
        };
  }

  /**
   * Ecrit l'attribut d du path d'un arc de cercle
   * @param array $center coordonnées du centre du cercle
   * @param float $radius rayon du cercle
   * @param float $startAngle angle de départ de l'arc en degré
   * @param float $endAngle angle final de l'Arc en degré
   * @return string attribut d du path de l'arc de cercle
   */
  describeArc(center, radius, startAngle, endAngle){
      //Petite correction quand end = start +360 car les deux points sont confondus
      if( endAngle == startAngle + 360){
          endAngle -= 0.1;
      }
      //calcul les coordonnées du point de départ et du point final
      let start = this.polarToCartesian( center, radius, startAngle);
      let end = this.polarToCartesian( center, radius, endAngle);

      //si le secteur angulaire est supérieure à 180° large-arc-flag = 1
      let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      let d = [
              "M", start.x, start.y,
              "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
      ];

      return d.join(" ");
  }



}
