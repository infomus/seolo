import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


export default function BasicTable({ Title, title2, name, title, timestamp, key}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        {/* <TableHead>
          <TableRow>
            <TableCell>{Title}</TableCell>
            <TableCell align="right">{title2}</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" key >
                {title}
              </TableCell>
              <TableCell align="right">{moment(timestamp).calendar()}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}