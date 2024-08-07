import { FavoritesView } from './Favorites.js';

const app = new FavoritesView('#app');


app.form.onsubmit = e => {
  e.preventDefault();

  let { value } = app.form.querySelector('input')

  const userExists = app.entries.find(u => u.login === value)
  console.log(userExists)
  if (userExists) return

  app.onadd(value)

}