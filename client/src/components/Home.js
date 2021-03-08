import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

import '../styles/global.css'
import '../styles/home.css';

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


export default function Orders() {
  return (
    <React.Fragment>
      <div className="home-container">
        <div className="title page-title">
          <Typography variant="h4">Live Auctions</Typography>
        </div>
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
      </div>
    </React.Fragment>
  );
}