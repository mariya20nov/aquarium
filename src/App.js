import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

class App extends Component {

  constructor() {
    super();

    const N = 10;
    const arrCube = [];
    for( let i = 0; i < N; i++) {
      arrCube.push(Math.floor(Math.random() * N));
    }

    this.state = {
      N: N,
      arrCube: arrCube,
    }

    //console.log("STATE", this.state);
  }

  countWater(arrCube) {
    let value = 0;
    const arrWaterCount = new Array(arrCube.length);
    arrWaterCount.fill(0);

    let max = Math.max(...arrCube);
    let max_index = arrCube.indexOf(max);

    let maxL = arrCube[0];
    for( let i = 1; i < max_index; i++) {
      if (arrCube[i] < maxL) {
        value += maxL - arrCube[i];
        arrWaterCount[i] = maxL - arrCube[i];
      } else {
        maxL = arrCube[i];
      }
      //console.log("i", i, " val", value);
    }

    let maxP = arrCube[arrCube.length - 1];
    for( let i = arrCube.length - 2; i > max_index; i--) {
      if (arrCube[i] < maxP) {
        value += maxP - arrCube[i];
        arrWaterCount[i] = maxP - arrCube[i];
      } else {
        maxP = arrCube[i];
      }
      //console.log("i", i, " val", value);
    }

    //console.log("VALUE", value);
    //console.log("ARR WATER COUNT", arrWaterCount);]
    return {arrWaterCount: arrWaterCount, value: value};

  }

  getColumns(arrCube) {
    const columns = [];
    for( let i = 0; i < arrCube.length; i++) {
      columns.push({
      Header: arrCube[i].toString(),
      accessor: i.toString(),
      sortable: false,
      //minWidth: '30px',
      Cell: cellInfo =>
        (
        <div style={cellInfo.value==="+" ? {backgroundColor : 'orange', color: 'transparent', width: '30px', height: '30px'}
          : (cellInfo.value==="-" ? {backgroundColor : 'blue', color: 'transparent', width: '30px', height: '30px'}: {backgroundColor : 'white', width: '30px', height: '30px'})
        }>{cellInfo.value}</div>
      )
    });
    }
    return columns;
  }

  getData(arrCube, arrWaterCount) {
    const data = [];
    const N = this.state.N;
    for( let i = 0; i < N + 2; i++) { // 10 000
      const obj = {};
      for( let j = 0; j < arrCube.length; j++) {
        obj[j] = ' ';
        if (i < arrCube[j]) {
          obj[j] = '+';
        } else if (i < (arrCube[j] + arrWaterCount[j])) {
          obj[j] = '-';
        }
      }
      data.push(obj);
    }

    const obj = {};
    for( let j = 0; j < arrCube.length; j++) {
      obj[j] = arrCube[j].toString();
    }
    data.push(obj);

    data.reverse();
    return data;
  }

  handleChange = files => {
    console.log("files", files);
    var fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = fileLoadedEvent => {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      const arrCube = JSON.parse("[" + textFromFileLoaded + "]");
      this.setState({N: arrCube.length, arrCube: arrCube});
    }
    // todo: fileReader.onerror
  }

  onDropdownChange = n => {
    const N = n.value;
    const arrCube = [];
    for( let i = 0; i < N; i++) {
      arrCube.push(Math.floor(Math.random() * N));
    }
    this.setState({N: N, arrCube: arrCube});
   }

  render() {

    const arrCube = this.state.arrCube;
    const N = this.state.N;

    //console.log('arrCube', arrCube);

    const waterCount = this.countWater(arrCube);
    const arrWaterCount = waterCount.arrWaterCount;
    const value = waterCount.value;

    const columns = this.getColumns(arrCube);


    const data = this.getData(arrCube, arrWaterCount, N);

    const options = [10, 20, 50, 100, 500, 1000, 10000, 100000];


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Задача про аквариум</h1>
        </header>

        <div className="SolutionDiv">
        <label> Ответ: {value} </label>

        <label> N :</label>
        <Dropdown
          options={options}
          onChange={this.onDropdownChange}
          placeholder={this.state.N.toString()}
        />

        <label>Считать массив из файла *.txt:</label>
        <input
          type="file"
          accept="text/plain"
          onChange={ e => this.handleChange(e.target.files)}
        />
        </div>

        <div className="TableDiv">
        <ReactTable
          data = {data}
          columns = {columns}
          pageSize={this.state.N + 4}
          //minWidth: {"30px"},
          showPagination = {false}
          resizable = {false}
          style={{
            maxWidth: (this.state.N*30).toString() + "px"  ///
          }}
        />
        </div>

      </div>
    );
  }
}

export default App;
