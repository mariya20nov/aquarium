import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import WebWorker from './WebWorker';
import MainWorker from './MainWorker';
import DataWorker from './DataWorker';

class App extends Component {

  constructor() {
    super();

    this.mainWorker = new WebWorker(MainWorker);
    this.dataWorker = new WebWorker(DataWorker);

    const N = 10;
    const arrCube = [];
    for( let i = 0; i < N; i++) {
      arrCube.push(Math.floor(Math.random() * N));
    }

    this.state = {
      N: N, // длина массива и max высота столбика из твердых кубиков, таблица будет N*N
      arrCube: arrCube, // массив распределения твердых кубиков
      value: 0, // общее число водяных кубиков
      arrWater: [], // массив распределения водяных кубиков
      data: [], // массив N*N значений в таблице
      columns: this.getColumns(arrCube), // колонки в таблице
    }
  }

  componentDidMount() { // поиск ответа и заполнение таблицы для первого рендера
    const arrCube = this.state.arrCube;
    const N = this.state.N;

    this.mainWorker.postMessage(arrCube);
    this.mainWorker.onmessage = (m) => {
      this.setState({
        N: N,
        arrCube: arrCube,
        value: m.data.value,
        arrWater: m.data.arrWater
      });
      this.dataWorker.postMessage({
        arrCube: arrCube,
        arrWater: m.data.arrWater,
        N: N});
    };
    this.dataWorker.onmessage = (m) => {
      this.setState({data: m.data.data});
    };
  }

  getColumns(arrCube) {
    const columns = [];
    for( let i = 0; i < arrCube.length; i++) {
      columns.push({
      Header: arrCube[i].toString(),
      accessor: i.toString(),
      sortable: false,
      headerStyle: {display: "none"},
      Cell: cellInfo => // задаем цвет ячеек в таблице
        (
        <div style={cellInfo.value==="+" ? {backgroundColor : 'orange', color: 'transparent', width: '30px', height: '30px'}
          : (cellInfo.value==="-" ? {backgroundColor : 'blue', color: 'transparent', width: '30px', height: '30px'}
          : (cellInfo.value==="@" ? {backgroundColor : 'black', color: 'transparent', width: '30px', height: '30px'}
          : {backgroundColor : 'white', width: '30px', height: '30px'}))
        }>{cellInfo.value}</div>
      )
    });
    }
    return columns;
  }

  onFileChange = files => {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = fileLoadedEvent => {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      const arrCube = JSON.parse("[" + textFromFileLoaded + "]");
      this.mainWorker.postMessage(arrCube);
      this.mainWorker.onmessage = (m) => {
        this.setState({
          N: arrCube.length,
          arrCube: arrCube,
          value: m.data.value,
          arrWater: m.data.arrWater,
          columns: this.getColumns(arrCube)
        });
        this.dataWorker.postMessage({
          arrCube: arrCube,
          arrWater: this.state.arrWater,
          N: this.state.N
        });
      };
      this.dataWorker.onmessage = (m) => {
        this.setState({data: m.data.data});
      };
    }
    // todo: fileReader.onerror
  }

  onDropdownChange = n => {
    const N = n.value;
    const arrCube = [];
    for( let i = 0; i < N; i++) {
      arrCube.push(Math.floor(Math.random() * N));
    }
    this.mainWorker.postMessage(arrCube);
    this.mainWorker.onmessage = (m) => {
      this.setState({
        N: N,
        arrCube: arrCube,
        value: m.data.value,
        arrWater: m.data.arrWater,
        columns: this.getColumns(arrCube)
      });
      this.dataWorker.postMessage({
        arrCube: arrCube,
        arrWater: this.state.arrWater,
        N: this.state.N
      });
    };
    this.dataWorker.onmessage = (m) => {
      this.setState({data: m.data.data});
    };
   }

  render() {
    const options = [10, 15, 20, 30, 50, 100, 200, 300, 400]; // массив N; можно занчения и >400, но отрисовывать таблицу будет ооооочень долго

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Задача про аквариум</h1>
        </header>

        <div className="SolutionDiv">
        <label> Ответ: {this.state.value} </label>

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
          onChange={ e => this.onFileChange(e.target.files)}
        />
        </div>

        <div className="TableDiv">
        <ReactTable
          data = {this.state.data}
          columns = {this.state.columns}
          pageSize={this.state.N + 2}
          showPagination = {false}
          resizable = {false}
          style={{
            maxWidth: (this.state.N*30 > 700 ? 700 : (this.state.N*30 + 20)).toString() + "px", // убрать магические числа
          }}
        />
        </div>

      </div>
    );
  }
}

export default App;
