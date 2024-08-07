export class GitSearch {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`
    return fetch(endpoint)
      .then(res => res.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))

  }
}


export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = this.root.querySelector('tbody');
    this.form = this.root.querySelector('form');
    this.vazio = this.root.querySelector('.vazio');
    this.tableForm = this.root.querySelector('.table-wrapper')
    this.load();
  }

  async add(value) {
    try {
      const user = await GitSearch.search(value)
      console.log(user)
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }
      this.entries = [...this.entries, user]
      this.update()
      this.save()
    } catch (error) {
      console.error(error.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@gitfav:users')) || []
  }

  delete(user) {
    this.entries = this.entries.filter(u => u.login !== user.login)
    this.update()
    this.save()
  }

  save() {
    localStorage.setItem('@gitfav:users', JSON.stringify(this.entries))
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.update();
  }

  onadd(value) {
    this.add(value)
  }

  update() {
    this.removeAllTr()
    this.verifyUsers()

    this.entries.forEach(user => {
      const row = this.createRow(user);

      row.querySelector('button').onclick = () => {
        const isOk = confirm('tem certeza que deseja remover o usuario?')
        if (isOk) {
          this.delete(user)
        } else {
          console.log('nAO')
        }
      }

      this.tbody.appendChild(row);
    })
  }

  removeAllTr() {
    this.root.querySelectorAll('tbody tr').forEach(tr => {
      tr.remove();
    })
  }

  createRow(user) {
    console.log(user)
    const tr = document.createElement('tr');
    tr.innerHTML = `
              <td class="user">
                <a href="https://github.com/${user.login}">
                  <img src="https://github.com/${user.login}.png" alt="${user.name}">
                  <div>
                    <p>${user.name}</p>
                    <span>/${user.login}</span>
                  </div>
                </a>
              </td>
              <td>${user.public_repos}</td>
              <td>${user.followers}</td>
              <td>
                <button>
                  Remover
                </button>
              </td>
    `

    return tr
  }

  verifyUsers() {
    if (this.entries.length === 0) {
      this.vazio.classList.remove('hide')
      this.tableForm.classList.add('active')
    } else {
      this.vazio.classList.add('hide')
      this.tableForm.classList.remove('active')
    }



  }



}

