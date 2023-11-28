import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
  }).middleware('isGuest')

  Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')

  Route.group(() => {
    Route.group(() => {
      Route.resource('categories', 'CategoriesController').only(['store', 'destroy', 'update'])
      Route.resource('products', 'ProductsController').only(['store', 'destroy', 'update'])
    }).middleware('isAdmin')
    Route.resource('profiles', 'ProfilesController').only(['update', 'show'])
    Route.resource('wishlistitems', 'WishlistItemsController').only(['index', 'store', 'destroy'])
    Route.resource('cart', 'CartItemsController').only(['store', 'destroy', 'index', 'update'])
    Route.resource('order', 'OrdersController').only(['store', 'index'])
    Route.resource('address', 'AddressesController').only(['store', 'update', 'destroy','index'])
  }).middleware('auth:api')
  Route.resource('products', 'ProductsController').only(['index', 'show'])

  Route.resource('categories', 'CategoriesController').only(['index', 'show'])
}).prefix('/api/v1')
