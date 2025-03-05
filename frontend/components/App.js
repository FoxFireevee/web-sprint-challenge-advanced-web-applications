import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [tokenState, setTokenState] = useState('')

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate('/') }
  const redirectToArticles = () => { /* ✨ implement */ navigate('articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    redirectToLogin()
    setMessage('Goodbye!')
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, {
      username,
      password
    })
      .then(res => {
        console.log('Logins Recieved username and password', username, password)
        localStorage.setItem('token', res.data.token)
        console.log("Data Check", res.data)
        setTokenState(res.data.token)
        setMessage(res.data.message)
        redirectToArticles()
        // getArticles()
        setSpinnerOn(false)
        // console.log('Login Message', res.data.message)
      })
      .catch(err => { console.error('Error:', err) })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    const token = localStorage.getItem('token')
    console.log("Token Tester", token)
    setMessage('')
    setSpinnerOn(true)
    axios.get(articlesUrl, { headers: { Authorization: tokenState } })
      .then(res => {
        // console.log("Result", res.data.articles)
        // console.log("Article Message", message)
        // console.log("Article Spinner", spinnerOn)
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
        return res.data.message
      })
      .catch(err => {
        if (!token) redirectToLogin()
        console.error('Error:', err)
        setSpinnerOn(false)
        throw err
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const token = localStorage.getItem('token')
    setMessage('')
    setSpinnerOn(true)
    axios.post(articlesUrl, article, { headers: { Authorization: token } })
      .then(res => {
        // console.log("Posts Success Message", res.data.message)
        setArticles(articles => { return articles.concat(res.data.article) })// setArticles([...articles, res.data.article])
        setMessage(res.data.message)
        const foundArticleId = articles.find(art => art.article_id == currentArticleId)
        // console.log("Did we find it?!", foundArticleId)
        // console.log("Checking Articles", articles)
        setSpinnerOn(false)
      })
      .catch(err => {
        if (!token) redirectToLogin()
        console.error('Error:', err)
        setMessage(err.message)
        setSpinnerOn(false)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setCurrentArticleId(article_id)
    console.log("Updated Current Article Id", article_id)
    // ✨ implement
    // You got this!
    const putArticleURL = `http://localhost:9000/api/articles/${article_id}`
    const token = localStorage.getItem('token')
    setMessage('')
    setSpinnerOn(true)
    axios.put(putArticleURL, article, { headers: { Authorization: token } })
      .then(res => {
        console.log("Updating Article Succeeded!", res)
        setMessage(res.message)
        setArticles(articles => {
          articles.map((art) => {
            art.article_id === article_id ? res.data.article : art
            console.log("Am I the Problem?", res.data.article)
          })
        })
      })
      .catch(err => {
        console.error('Updating the Article went wrong', err)
        setMessage(err.response.data.message)
        if (err.response.status == 401) {
          redirectToLogin()
        }
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  // console.log("Checking in on Articles", articles)

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                currentArticle={articles.find(art => art.article_id == currentArticleId)} 
                setCurrentArticleId={setCurrentArticleId} />
              <Articles 
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                articles={articles} 
                currentArticle={currentArticleId} 
                setCurrentArticleId={setCurrentArticleId} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}

