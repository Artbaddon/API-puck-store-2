interface updateOrCreateProfileType {
  first_name: string
  last_name: string
  user_id: number
}

interface updateProfileType {
  id: number
  first_name?: string
  last_name?: string
  profile_picture?: string
  password?: string
}

interface createUserType {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface storeCategoryType {
  name: string
  description: string
  category_image: string
}

interface updateCategoryType {
  id: number
  name?: string
  description?: string
  category_img?: string
}

interface storeProductType {
  name: string
  description: string
  price: number
  image: string
  category_id: number
}

interface updateProductType {
  id: number
  name?: string
  description?: string
  price?: number
  image?: string
  category_id?: number
}

interface updateCartItemType {
  id: number
  quantity?: number
}
