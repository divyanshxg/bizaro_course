
import About from './pages/About'
import Detail from './pages/Detail'
import Home from './pages/Home'
import Collections from './pages/Collections'
import { each } from 'lodash'


class App {

  constructor() {
    // console.log("App...")

    this.createContent()
    this.createPages()


    this.addLinkListeners()
  }

  createContent() {
    this.content = document.querySelector(".content")
    this.template = this.content.getAttribute("data-template")
    // console.log(this.template)
  }

  createPages() {
    this.pages = {
      "home": new Home(),
      "collections": new Collections(),
      "detail": new Detail(),
      "about": new About()
    }

    this.page = this.pages[this.template]

    this.page.create()

    this.page.show()


    // console.log(this.page)




  }


  async onChange(url) {

    // console.log(url)


    await this.page.hide()


    const request = await window.fetch(url)

    if (request.status == 200) {

      const html = await request.text()

      const div = document.createElement("div")

      div.innerHTML = html

      const divContent = div.querySelector(".content")

      this.template = divContent.getAttribute("data-template")
      this.content.setAttribute("data-template", this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()


      // console.log(text)
    } else {

      console.log("Error")
    }


  }
  addLinkListeners() {
    const links = document.querySelectorAll("a")


    each(links, link => {
      link.onclick = event => {
        const { href } = link

        this.onChange(href)
        event.preventDefault()
        // console.log(event, href)
      }
    })

  }
}

new App()
