import gsap from "gsap";
import Animation from "../classes/Animation";
import { calculate, split } from '../utils/text.js'
import { each } from "lodash";


export default class Title extends Animation {
  constructor({ element, elements }) {

    super({
      element,
      elements
    })


    split({
      element: this.element, append: true
    })

    split({
      element: this.element, append: true
    })

    this.elementLinesSpans = this.element.querySelectorAll('span span')





  }


  animateIn() {

    // if (this.isAnimatedIn) {
    //   return;
    // }

    // this.isAnimatedIn = true

    this.timelineIn = gsap.timeline({
      delay: 0.3
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })


    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(line, {
        // autoAlpha: 1,
        y: "100%"
      }, {
        // autoAlpha: 1,
        delay: index * 0.2,
        duration: 1.5,
        ease: "expo.out",
        y: "0%",
        // stagger: 0.2

        // stagger: {
        //   grid: "y",
        //   each: 1
        // }
      }, 0)

    })


  }
  animateOut() {
    // this.isAnimatedIn = false;

    gsap.set(this.element, {
      autoAlpha: 0
    })

  }


  onResize() {

    this.elementLines = calculate(this.elementLinesSpans)
  }
}
