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


//need to add live auctions still as a bonus 
const rows = [
  createData(0, '16 Nov, 2021', 'Blender',  '$200', 'Dutch'),
  createData(1, '16 Nov, 2021', 'Hockey Stick',  '$100', 'English'),
  createData(2, '16 Nov, 2021', 'Pokemon Card',  '$250', 'Sealed'),
  createData(3, '16 Nov, 2021', 'Shoes',  '$100', 'Sealed'),
  createData(4, '15 Nov, 2021', 'Shirt', '$20', 'Englsih'),
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
              <TableCell>Current Bid To Beat</TableCell>
              <TableCell>Auction Type</TableCell>
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