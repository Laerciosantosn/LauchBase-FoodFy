const { hash } = require('bcryptjs')
const faker = require('faker')

const Users = require('./src/app/models/users')
const Chefs = require('./src/app/models/chefs')
const Recipes = require('./src/app/models/recipes')
const RecipeFiles = require('./src/app/models/recipesFile')
const File = require('./src/app/models/file')

let totalChefs = 5
let totalUsers = 2 // Foi criado dois usuários Admin e Profile
let totalRecipes = 8
const maxImageRecipes = 5

let path = ''


async function createUsers() {
  const users = []

  async function userAdmin(password) {
    users.push({
      name: faker.name.firstName(),
      email: 'admin@foodfy.com',
      password: password,
      is_admin: true
    })
  }
  async function userProfile(password) {
    users.push({
      name: faker.name.firstName(),
      email: 'profile@foodfy.com',
      password: password,
      is_admin: false
    })
  }

  userAdmin(await hash('admin', 8))
  userProfile(await hash('profile', 8))

  const usersPromise = users.map(user => Users.create(user))
  userIds = await Promise.all(usersPromise)
}

async function fileCreate(data) {
  let files = []

  while (files.length < data.total) {
    files.push({
      name: faker.image.image(),
      path: data.path
    })
  }

  const filePromise = files.map(file => File.create(file))
  const filesResult = await Promise.all(filePromise)

  return filesResult
}

async function createChefs() {
  let chefs = []
  path = `public/images/placeholderChef.png`
  let files = await fileCreate({
    path,
    total: totalChefs
  })

  files.map(file =>
    chefs.push({
      name: faker.name.findName(),
      file_id: file.id
    })
  )

  const chefsPromise = chefs.map(chef => Chefs.create(chef))
  await Promise.all(chefsPromise)
}

async function createRecipes() {
  let recipes = []

  path = `public/images/placeholderRecipes.jpg`

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: Math.ceil(Math.random() * totalChefs),
      title: faker.name.title(),
      ingredients: [faker.lorem.words()],
      preparation: [faker.lorem.words()],
      information: faker.random.words(),
      user_id: Math.ceil(Math.random() * totalUsers)
    })
  }

  const recipesPromise = recipes.map(recipe => Recipes.createWithArray(recipe))
  const recipesResults = await Promise.all(recipesPromise)

  const filesPromise = recipesResults.map(() => fileCreate({
    path,
    total: maxImageRecipes
  }))
  let filesResult = await Promise.all(filesPromise)

  const recipeFile = []
  const testPromise = filesResult.map(file =>
    file.map(f => recipeFile.push({ id: f.id })))
  await Promise.all(testPromise)

  const filesRecipesPromise = recipeFile.map(recipe => RecipeFiles.create({
    file_id: recipe.id,
    recipe_id: Math.ceil(Math.random() * totalRecipes)
  }))
  await Promise.all(filesRecipesPromise)
}

async function init() {
  await createUsers()
  await createChefs()
  await createRecipes()
}

init()