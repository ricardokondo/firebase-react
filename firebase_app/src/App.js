import { db } from "./firebaseConnection";
import { useState } from "react";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  const [posts, setPosts] = useState([]);

  async function handleAdd() {
    /* Maneira de se adicionar informações de maneira estática
    await setDoc(doc(db, "post", "12345"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Dados registrados no banco");
      })
      .catch((error) => {
        console.log("Gerou um erro" + error);
      });
      */
    //Adicionar uma coleção de dados randômico
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Dados registrados no banco");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Gerou um erro ao adicionar" + error);
      });
  }

  async function buscarPost() {
    /* Busca simples retornando somente 1 dados no qual eu insiro o valor 
    const postRef = doc(db, "posts", "gdySjr5e8Yu6BdNot9eJ");

    await getDoc(postRef)
      .then((snapshot) => {
        console.log("Dados retornados do banco");
        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      })
      .catch((error) => {
        console.log("Gerou um erro ao buscar" + error);
      });
      */
    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log("DEU ALGUM ERRO AO BUSCAR");
      });
  }

  return (
    <div>
      <h1>React project + Firebase</h1>
      <div className="container">
        <label>Título: </label>
        <textarea
          type="text"
          placeholder="Digite seu título"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
        />
        <label>Autor: </label>
        <textarea
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(event) => setAutor(event.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor}</span> <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
