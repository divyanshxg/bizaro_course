import { each } from "lodash";
import Component from "../classes/Component";
import gsap from "gsap";
import { split } from "../utils/text";


export default class Preloader extends Component {

  constructor() {

    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
        images: document.querySelectorAll("img")
      }
    })

    // This will make one span inside the other so , we can set the outer one to be overflow hidden
    split({
      element: this.elements.title,
      expression: "<br>"
    })

    split({
      element: this.elements.title,
      expression: "<br>"
    })

    this.elements.titleSpans = this.elements.title.querySelectorAll("span span")

    this.length = 0;

    // console.log(this.element, this.elements)

    this.createLoader()
    // setTimeout(() => {
    //
    //   this.emit("completed")
    // }, 1000)

  }

  createLoader() {
    each(this.elements.images, element => {

      element.src = element.getAttribute("data-src")
      element.onload = () => this.onAssetLoaded(element)

    })
  }


  onAssetLoaded(image) {
    this.length += 1

    const percent = this.length / this.elements.images.length

    console.log("---")
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent == 1) {
      this.onLoaded()
    }

  }

  onLoaded() {


    return new Promise(resolve => {
      this.animateOut = gsap.timeline({
        delay: 1
      })
      this.animateOut.to(this.elements.titleSpans, {
        // autoAlpha: 0,
        y: "100%",
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1
      })
      this.animateOut.to(this.elements.numberText, {
        // autoAlpha: 0,
        y: "100%",
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1
      }, "-=1.4")
      this.animateOut.to(this.element, {
        // autoAlpha: 0
        scaleY: 0,
        transformOrigin: "100% 100%",
        duration: 1.5,
        ease: "expo.out"
      }, "-=1")
      this.animateOut.call(_ => {
        this.emit("completed")
      })
    })

    // this.emit("completed")

  }


  destroy() {
    this.element.parentNode.removeChild(this.element)

  }
}
