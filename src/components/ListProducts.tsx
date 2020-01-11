import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import Delete from "@material-ui/icons/Delete";

import firebase from "firebase";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: `${theme.spacing(5)}px 0px`,
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  img: {
    maxWidth: 100
  }
}));

interface ListProductsProps {
  tab: { key: string; value: string };
}

interface Row {
  productTitle: string;
  desription: any;
  thumbnailFile: string;
  imageFile: string;
  pdf: string;
}

export const ListProducts: React.FC<ListProductsProps> = ({ tab }) => {
  const classes = useStyles();

  const [data, setData] = useState<null | any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      firebase
        .firestore()
        .collection(tab.value)
        .get()
        .then(querySnapshot => {
          let documents = querySnapshot.docs.map(doc => {
            return doc.data();
          });
          return documents;
        })
        .then(docs => {
          setIsLoading(false);
          setData(docs);
        })
        .catch(err => {
          console.log("error in listing products", err);
          setIsError(true);
          setIsLoading(false);
        });
    };
    fetchData();
  }, [tab.key]);

  if (isError) {
    return <FormHelperText error>{isError}</FormHelperText>;
  }
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Thumbnail</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">PDF</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: Row) => {
            return (
              <TableRow key={row.productTitle}>
                <TableCell component="th" scope="row">
                  {row.productTitle}
                </TableCell>
                <TableCell align="right">
                  {row.desription.blocks[0].text}
                </TableCell>
                <TableCell align="right">
                  <img
                    className={classes.img}
                    src={row.thumbnailFile}
                    alt="thumbnail"
                  />
                </TableCell>
                <TableCell align="right">
                  <img
                    className={classes.img}
                    src={row.imageFile}
                    alt="imageFile"
                  />
                </TableCell>
                <TableCell align="right">
                  <a
                    className={classes.img}
                    href={row.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    pdf
                  </a>
                </TableCell>
                <TableCell align="right">
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};
