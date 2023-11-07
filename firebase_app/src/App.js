import { db, auth } from "./firebaseConnection";
import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// import relacionando com o firebase auth que é responsável pela autenticação do usuário no sistema
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [idade, setIdade] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      // Verifica em tempo real com o banco e retorna as informações de maneira automática
      // onSnapshot é um listener que fica escutando as alterações no banco de dados e retorna as informações em tempo real
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            idade: doc.data().idade,
          });
        });

        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    // Esta função verifica se o usuário está logado ou não no sistema e retorna true ou false
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem usuário logado ele entra aqui
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          // não possui usuário logado
          setUser(false);
          setUserDetail({});
        }
      });
    }

    checkLogin();
  }, []);

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
      idade: idade,
    })
      .then(() => {
        console.log("Dados registrados no banco");
        setTitulo("");
        setAutor("");
        setIdade("");
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
            idade: doc.data().idade,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log("DEU ALGUM ERRO AO BUSCAR");
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
      idade: idade,
    })
      .then(() => {
        console.log("Dados atualizado");
        setIdPost("");
        setTitulo("");
        setAutor("");
        setIdade("");
      })
      .catch((error) => {
        console.log("Gerou um erro ao adicionar" + error);
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);

    await deleteDoc(docRef)
      .then(() => {
        alert("Dados excluído com sucesso.");
      })
      .catch((error) => {
        console.log("Gerou um erro ao adicionar" + error);
      });
  }

  // Função para cadastrar um novo usuário no sistema utilizando o firebase auth (autenticação) e o firebase firestore (banco de dados)
  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("Cadastrado com sucesso.");
        //console.log(value);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        //console.log("Gerou um erro ao cadastrar" + error);
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("Usuário logado com sucesso.");
        //console.log(value);
        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });

        setUser(true);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.log("Gerou um erro ao fazer login" + error);
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>React project + Firebase</h1>

      {user && (
        <div>
          <strong> Seja bem-vindo(a) (Você está logado)</strong> <br />
          <span>
            Id: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <hr />
        </div>
      )}
      <div className="container">
        <h2>Usuários</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />
        <br />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
        <br />
      </div>

      <hr />
      <br />
      <br />
      <div className="container">
        <h2>Posts</h2>
        <label>Id do Post</label>
        <input
          placeholder="Digite o ID do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />
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
        <label>Idade: </label>
        <textarea
          type="text"
          placeholder="Idade"
          value={idade}
          onChange={(event) => setIdade(event.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button> <br />
        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>ID: {post.id}</span> <br />
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor}</span> <br />
                <span>Idade: {post.idade}</span> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir post
                </button>{" "}
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
