import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { postArticle, updateArticle, currentArticle, setCurrentArticleId } = props
  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (currentArticle) {
      // console.log('Articles - Testing UseEffect', articles)
      console.log("Values - Testing UseEffect", values)
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      })
      console.log("Values", values)
    }
    else {
      setValues(initialFormValues)
    }
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    const currentArticleData = {
      title: values.title,
      text: values.text,
      topic: values.topic,
    }
    console.log("Submitted Article Data", currentArticleData)
    currentArticle ? 
      updateArticle({currentArticleData, article_id: currentArticle.article_id}) 
      : 
      postArticle(currentArticleData)

    setCurrentArticleId()
    setValues(initialFormValues)

    console.log("Current Article", currentArticle)


    // Old logic that got transformed into the above ternary expression ^^^
    // if(currentArticle) {
    //   // setValues(currentArticleData)
    //   updateArticle({currentArticleData, article_id: currentArticle.article_id})
    // } else {
    //   postArticle(currentArticleData)
    //   setCurrentArticleId(null)
    // }
    // // postArticle({text: values.text, title: values.title, topic: values.topic})
    // console.log('Finalized Values', values)
    // setValues(initialFormValues)
  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some 
    if(values.text.length <= 0 || values.title.length <= 0 || values.topic.length <= 0) {
      return true
    }
    return false
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={Function.prototype}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
