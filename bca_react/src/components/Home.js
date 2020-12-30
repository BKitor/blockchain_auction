import React from 'react';

import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(0, '16 Nov, 2020', 'Blender', 'Tupelo, MS', '$200', 300),
  createData(1, '16 Nov, 2020', 'Hockey Stick', 'London, UK', '$100', 150),
  createData(2, '16 Nov, 2020', 'Pokemon Card', 'Boston, MA', '$250', 300),
  createData(3, '16 Nov, 2020', 'Shoes', 'Gary, IN', '$100', 120),
  createData(4, '15 Nov, 2020', 'Shirt', 'Long Branch, NJ', '$20', 35),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h4">Live Auctions</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Auction Ends</TableCell>
            <TableCell>Item for Sale</TableCell>
            <TableCell>Ships From</TableCell>
            <TableCell>Current Bid To Beat</TableCell>
            <TableCell align="right">Buy Now Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more Auctions
        </Link>
      </div>
    </React.Fragment>
  );
}