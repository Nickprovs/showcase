import { Editor } from '@tinymce/tinymce-react';

const FormHtmlEditor = ({ name, label, error, init, initialValue, ...rest }) => {
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
            initialValue = {initialValue ? initialValue : "<p></p>"}
            init= {init ? init : {
                  width: "95%",
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
                }}
            />       
          <div>
            <label className="form-label-error" htmlFor={name}>
              {error}
            </label>
          </div>
      </div>
    );
  };
  
  export default FormHtmlEditor;
  