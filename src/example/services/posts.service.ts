import { from, map } from "rxjs";
import { BaseStore } from "src/core/BaseStore";

interface Posts {
  posts: {id: number, body: string, title: string}[]
}
const initialState = {posts: []}
class Post extends BaseStore<Posts> {
  constructor() {
    super(initialState)
  }

  public fetchPosts() {
    return from(
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      }).then((res) => res.json())
    ).pipe(map((res) => res.slice(0, 10)))
  }

  public setPosts() {
    this.fetchPosts().subscribe((res) => this.setState({posts: res}))
  }

  public getPosts() {
    return this.getState((state) => ({posts: state.posts}))
  }
}

export default new Post()