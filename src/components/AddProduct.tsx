import React from "react";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MUIRichTextEditor from "mui-rte";
import { defaultTheme } from "../theme";
import { firestore } from "firebase";
import { storage } from "firebase";
import { Formik } from "formik";
import * as yup from "yup";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`
  }
}));

let schema = yup.object().shape({
  productTitle: yup.string().required(),
  desription: yup.object().required(),
  thumbnail: yup.object().nullable(),
  image: yup.object().nullable(),
  pdf: yup.object().nullable()
});

interface FormState {
  productTitle: string;
  desription: any;
  thumbnailFile: Blob | null;
  imageFile: Blob | null;
  pdf: Blob | null;
}

const initialValues: FormState = {
  productTitle: "",
  desription: null,
  thumbnailFile: null,
  imageFile: null,
  pdf: null
};

interface AddProps {
  tab: { key: string; value: string };
}

export const AddProduct: React.FC<AddProps> = ({ tab }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
        if (
          values.imageFile !== null &&
          values.thumbnailFile !== null &&
          values.pdf !== null
        ) {
          var storageRef = storage().ref();
          var thumbnail = storageRef.child(
            `${tab.value}/${values.productTitle}/thumbnail`
          );
          thumbnail
            .put(values.thumbnailFile)
            .then(snapshot => {
              thumbnail.getDownloadURL().then(thumbnailURL => {
                if (values.imageFile !== null) {
                  var image = storageRef.child(
                    `${tab.value}/${values.productTitle}/image`
                  );
                  image
                    .put(values.imageFile)
                    .then(snapshot => {
                      image.getDownloadURL().then(imageURL => {
                        if (values.pdf !== null) {
                          var pdf = storageRef.child(
                            `${tab.value}/${values.productTitle}/pdf`
                          );
                          pdf
                            .put(values.pdf)
                            .then(snapshot => {
                              pdf.getDownloadURL().then(pdfURL => {
                                // add to firestore after checking that all three blob files are uploaded to storage

                                firestore()
                                  .collection(tab.value)
                                  .doc(values.productTitle)
                                  .set(
                                    Object.assign(
                                      {},
                                      {
                                        productTitle: values.productTitle,
                                        desription: values.desription,
                                        thumbnailFile: thumbnailURL,
                                        imageFile: imageURL,
                                        pdf: pdfURL
                                      }
                                    )
                                  )
                                  .then(() => {
                                    setSubmitting(false);
                                    console.log(
                                      "Document successfully written!"
                                    );
                                  })
                                  .catch(error => {
                                    console.error(
                                      "Error writing document: ",
                                      error
                                    );
                                  });
                              });
                            })
                            .catch(err => {
                              console.log("err", err);
                              setFieldError("pdf", "try again");
                            });
                        }
                      });
                    })
                    .catch(err => {
                      console.log("err", err);
                      setFieldError("imageFile", "try again");
                    });
                }
              });
            })
            .catch(err => {
              console.log("err", err);
              setFieldError("thumbnailFile", "try again");
            });
        } else {
          if (values.imageFile === null)
            setFieldError("imageFile", "this field is required");
          if (values.thumbnailFile === null)
            setFieldError("thumbnailFile", "this field is required");
          if (values.pdf === null)
            setFieldError("pdf", "this field is required");
        }
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldError
      }) => {
        const save = (data: any) => {
          setFieldValue("desription", JSON.parse(data));
        };

        const handleChangeStatus = (props: any, fileType: string) => {
          if (props.meta.status === "done") {
            setFieldValue(fileType, props.file);
          } else if (props.meta.status === "aborted") {
            setFieldError(fileType, "file not uploaded");
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={5}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  fullWidth={true}
                  label="Product Title *"
                  variant="outlined"
                  name="productTitle"
                  onChange={handleChange}
                  error={
                    errors.productTitle ? Boolean(errors.productTitle) : false
                  }
                  helperText={errors.productTitle ? errors.productTitle : null}
                  value={values.productTitle}
                />
              </Grid>
              <Grid item>
                <Dropzone
                  addClassNames={{ dropzone: classes.margin }}
                  onChangeStatus={e => handleChangeStatus(e, "thumbnailFile")}
                  accept="image/*"
                  maxFiles={1}
                  multiple={false}
                  inputContent="Drop Thumbnail Files *"
                  disabled={files =>
                    files.some(f =>
                      [
                        "preparing",
                        "getting_upload_params",
                        "uploading"
                      ].includes(f.meta.status)
                    )
                  }
                />
                {errors.thumbnailFile && (
                  <FormHelperText error>{errors.thumbnailFile}</FormHelperText>
                )}
                <Dropzone
                  addClassNames={{ dropzone: classes.margin }}
                  onChangeStatus={e => handleChangeStatus(e, "imageFile")}
                  accept="image/*"
                  maxFiles={1}
                  multiple={false}
                  inputContent="Drop Image Files *"
                  disabled={files =>
                    files.some(f =>
                      [
                        "preparing",
                        "getting_upload_params",
                        "uploading"
                      ].includes(f.meta.status)
                    )
                  }
                />
                {errors.imageFile && (
                  <FormHelperText error>{errors.imageFile}</FormHelperText>
                )}
                <Dropzone
                  addClassNames={{ dropzone: classes.margin }}
                  onChangeStatus={e => handleChangeStatus(e, "pdf")}
                  accept="application/pdf"
                  maxFiles={1}
                  multiple={false}
                  inputContent="Drop PDF Files *"
                  disabled={files =>
                    files.some(f =>
                      [
                        "preparing",
                        "getting_upload_params",
                        "uploading"
                      ].includes(f.meta.status)
                    )
                  }
                />
                {errors.pdf && (
                  <FormHelperText error>{errors.pdf}</FormHelperText>
                )}
              </Grid>
              <Grid item>
                <MuiThemeProvider theme={defaultTheme}>
                  <MUIRichTextEditor
                    onSave={save}
                    inlineToolbar={true}
                    label="Product Description *"
                    error={
                      errors.desription ? Boolean(errors.desription) : false
                    }
                  />
                </MuiThemeProvider>
              </Grid>
              <Grid item>
                {isSubmitting ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Add Product
                  </Button>
                )}
              </Grid>
            </Grid>
            {errors.thumbnailFile && (
              <FormHelperText error>{errors.thumbnailFile}</FormHelperText>
            )}
            {errors.imageFile && (
              <FormHelperText error>{errors.imageFile}</FormHelperText>
            )}
            {errors.pdf && <FormHelperText error>{errors.pdf}</FormHelperText>}
            {errors.productTitle && (
              <FormHelperText error>{errors.productTitle}</FormHelperText>
            )}
            {errors.desription && (
              <FormHelperText error>{errors.desription}</FormHelperText>
            )}
            {console.log("errors", errors)}
          </form>
        );
      }}
    </Formik>
  );
};
