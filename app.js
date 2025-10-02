require("dotenv").config()
// console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID)

const logger = require("morgan")
const express = require("express")
const errorHandler = require("errorhandler")
const app = express()
const path = require("path")
const Prismic = require('@prismicio/client');
const PrismicH = require("@prismicio/helpers")
const fetch = require("node-fetch")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")




app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(methodOverride())
app.use(errorHandler())

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};


// Link Resolver
const HandleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === 'collections') {
    return '/collections';
  }

  if (doc.type === 'about') {
    return `/about`;
  }

  return '/';
};

const handleRequest = async (api) => {
  const [meta, preloader, navigation, home, about, { results: collections }] =
    await Promise.all([
      api.getSingle('meta'),
      api.getSingle('preloader'),
      api.getSingle('navigation'),
      api.getSingle('home'),
      api.getSingle('about'),
      api.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image',
      }),
    ]);

  // console.log(meta, preloader, navigation, home, about, collections)
  //   console.log(about, home, collections);

  const assets = [];
  //
  // console.log(home)
  // home.data.gallery.forEach((item) => {
  //   assets.push(item.image.url);
  // });
  //
  // about.data.gallery.forEach((item) => {
  //   assets.push(item.image.url);
  // });
  //
  // about.data.body.forEach((section) => {
  //   if (section.slice_type === 'gallery') {
  //     section.items.forEach((item) => {
  //       assets.push(item.image.url);
  //     });
  //   }
  // });
  //
  // collections.forEach((collection) => {
  //   collection.data.list.forEach((item) => {
  //     assets.push(item.product.data.image.url);
  //   });
  // });
  //
  // console.log(assets);
  //
  return {
    assets,
    meta,
    home,
    collections,
    about,
    navigation,
    preloader,
  };
  //
  // return {}
};


// Middleware to inject prismic context
app.use((req, res, next) => {
  // const ua = UAParser(req.headers['user-agent']);
  //
  // res.locals.isDesktop = ua.device.type === undefined;
  // res.locals.isPhone = ua.device.type === 'mobile';
  // res.locals.isTablet = ua.device.type === 'tablet';

  res.locals.Link = HandleLinkResolver;
  res.locals.PrismicH = PrismicH;
  res.locals.Numbers = (index) => {
    return index === 0
      ? 'One'
      : index === 1
        ? 'Two'
        : index === 2
          ? 'Three'
          : index === 3
            ? 'Four'
            : '';
  };

  next();
});

const port = 3000

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// app.get("/", (req, res) => {
//   res.render("index", {
//     meta: {
//       data: {
//         title: "Floema",
//         description: "Metadata description"
//       }
//     }
//   })
// })


app.get("/", async (req, res) => {

  const api = await initApi(req);
  const defaults = await handleRequest(api);


  const { results : collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks : "product.image"
  })


  res.render("pages/home" , {
    ...defaults,
    collections
  })
})


// app.get("/about", async (req, res) => {
//   res.render("pages/about")
// })


app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const {about , meta} = defaults;

  // console.log(about , meta)


  console.log(about.data.body)
  // console.log(about.data.gallery)


  // console.log({ ...defaults })
  res.render('pages/about', {
    ...defaults,
  });
});

app.get("/detail/:uid", async(req, res) => {

  // console.log(req.params.uid)

  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });
  // const product = await api.getByUID('product', req.params.uid);
  //
  console.log(product)
  // const {about , meta} = defaults;

  res.render("pages/detail" , {
    ...defaults,
    product
  })
})


app.get("/collections", async (req, res) => {

  const api = await initApi(req);
  const defaults = await handleRequest(api);

  // const collections = api.query(Prismic.Predicates.at('document.type', 'collection'), {
  //       fetchLinks: 'product.image',
  //     }),

  const { results : collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks : "product.image"
  })
  console.log(collections)

  res.render("pages/collections" , {
    ...defaults,
    collections
  })
})



app.listen(port, () => {
  console.log(`Example app listening at port : ${port}`)
})
