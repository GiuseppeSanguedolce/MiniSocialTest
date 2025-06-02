import React from "react";
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";

function CreatePost() {
  // 🎯 Valori iniziali del form
  const initialValues = {
    title: "",
    postText: "",

  };

  // 📤 Cosa succede quando clicchi "Submit"
  const onSubmit = (data) => {
    console.log("Dati inviati:", data);
    // Qui puoi aggiungere axios.post(...) se vuoi inviarlo al backend!
    axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      console.log("Funziona");
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Il titolo è obbligatorio"),
    postText: Yup.string().min(10, "Il post deve avere almeno 10 caratteri").required("Il testo è obbligatorio"),
  });
  return (
    <div className="createPostPage">
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className="formContainer">
          {/* CAMPO TITOLO */}
          <label>Title: </label>
          <ErrorMessage name="title" component="span"/>
          <Field
          autoComplete ="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />

          {/* CAMPO TESTO POST */}
          <label>Post: </label>
          <ErrorMessage name="postText" component="span"/>
          <Field
            autoComplete ="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />

       

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;