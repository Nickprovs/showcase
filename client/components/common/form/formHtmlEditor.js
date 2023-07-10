import { Editor } from "@tinymce/tinymce-react";

function FormHtmlEditor({ name, label, error, init, initialValue, darkModeOn, ...rest }) {
  let optionalThemeData = {};

  if (darkModeOn) {
    optionalThemeData.skin = "oxide-dark";
    optionalThemeData.content_css = "dark";
  }

  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <Editor
        {...rest}
        name={name}
        id={name}
        init={
          init
            ? init
            : {
                ...optionalThemeData,
                width: "96%",
                height: 750,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
              }
        }
      />
      <div>
        <label className="form-label-error" htmlFor={name}>
          {error}
        </label>
      </div>
    </div>
  );
}

export default FormHtmlEditor;
